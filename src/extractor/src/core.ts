import { default as defaultOptions } from './options'
import type {Options } from './options'
import { MasterCSS } from '../../core/src/index'
import type { Config } from '../../core/src/index'
import extractLatentClasses from './functions/extract-latent-classes'
import fs, { existsSync } from 'fs'
import { minimatch } from 'minimatch'
import extend from '../../shared/utils/extend'
import { explorePathsSync } from '@techor/glob'

import exploreConfig from 'explore-config'
import exploreCSSConfig from '@master/css-explore-config'

//import { generateValidRules } from '@master/css-validator'
import { generateValidRules } from '../../validator/index'

import chokidar, { type ChokidarOptions, type FSWatcher } from 'chokidar'
import { EventEmitter } from 'node:events'
import cssEscape from '../../shared/utils/css-escape'
import path, { resolve } from 'path'
import { Stats } from 'node:fs'

// TODO:, does there need to be a "exploreConfig" tool?
// TODO maybe make a logging tool?

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export default class CSSExtractor extends EventEmitter {
    latentClasses = new Set<string>()
    validClasses = new Set<string>()
    invalidClasses = new Set<string>()
    watching = false
    watchers: FSWatcher[] = []
    initialized = false

    constructor(
        public customOptions: Options | string = 'master.css-extractor',
        public cwd = process.cwd()
    ) {
        super()
    }

    init(customOptions = this.customOptions) {
        if (this.initialized) return
        if (typeof customOptions === 'string') {
            this.options = extend(defaultOptions, exploreConfig(customOptions, {
                found: (basename) => log.i`Loaded **${basename}**`,
                cwd: this.cwd
            }), customOptions)
        } else {
            this.options = extend(defaultOptions, customOptions)
        }
        if (this.options.verbose && this.options.verbose > 1) {
          //do logging
        }
        this.css = new MasterCSS(
            typeof this.options.config === 'object'
                ? this.options.config
                : exploreCSSConfig({
                    name: this.options.config as string,
                    cwd: this.cwd
                })
        )
        this.emit('init', this.options, this.config)
        this.initialized = true
        return this
    }

    async reset(customOptions = this.customOptions) {
        const watching = this.watching
        if (watching) await this.closeWatch({ emit: false })
        this.latentClasses.clear()
        this.validClasses.clear()
        this.invalidClasses.clear()
        this.initialized = false
        this.init(customOptions)
        await this.prepare()
        if (watching) await this.startWatch({ emit: false })
        this.emit('reset')
        return this
    }

    async destroy() {
        this.latentClasses.clear()
        this.validClasses.clear()
        this.invalidClasses.clear()
        this.removeAllListeners()
        await this.closeWatch()
        this.emit('destroy')
        return this
    }

    async prepare() {
        /* 插入指定的固定 class */
        if (this.options.classes?.fixed?.length) {
            for (const eachFixedClass of this.options.classes.fixed) {
                this.css.add(eachFixedClass)
            }
            if (this.options.verbose) {
                //log.ok`${this.options.classes.fixed.length} fixed classes inserted ${this.options.classes.fixed}`
            }
        }
        await Promise.all([
            this.insertFiles(this.fixedSourcePaths),
            this.insertFiles(this.allowedSourcePaths)
        ])
    }

    /**
     * @description Filter based on relative file paths and extract content
     * @param source
     * @param content
     * @returns string[] Latent classes
     */
    extract(source: string, content: string): string[] {
        if (!source || !content || !this.isSourceAllowed(source)) {
            return []
        }
        const latentClasses: string[] = []
        for (const eachLatentClasses of extractLatentClasses(content)) {
            if (this.latentClasses.has(eachLatentClasses)) {
                continue
            } else {
                this.latentClasses.add(eachLatentClasses)
                latentClasses.push(eachLatentClasses)
            }
        }
        return latentClasses
    }

    /**
     * @description Filter based on relative file paths, extract content, and insert
     * @param source
     * @param content
     * @returns string[] Latent classes
     */
    async insert(source: string, content: string): Promise<boolean> {
        if (!content) {
            return false
        }
        let latentClasses = this.extract(source, content)
        if (!latentClasses.length) {
            return false
        }

        /**
         * 排除已驗證為 invalid 的 extraction
         */
        if (this.invalidClasses.size) {
            latentClasses = latentClasses.filter((eachLatentClass) => !this.invalidClasses.has(eachLatentClass))
        }

        /**
         * 排除已驗證為 valid 的 extraction
         */
        if (this.validClasses.size) {
            latentClasses = latentClasses.filter((eachLatentClass) => !this.validClasses.has(eachLatentClass))
        }

        /* 排除指定的 class */
        if (this.options.classes?.ignored?.length)
            latentClasses = latentClasses.filter((eachLatentClass) => {
                if (this.options.classes?.ignored)
                    for (const eachIgnoreClass of this.options.classes.ignored) {
                        if (typeof eachIgnoreClass === 'string') {
                            if (eachIgnoreClass === eachLatentClass) return false
                        } else if (eachIgnoreClass.test(eachLatentClass)) {
                            return false
                        }
                    }
                return true
            })

        let time = process.hrtime()
        /* 根據類名尋找並插入規則 ( MasterCSS 本身帶有快取機制，重複的類名不會再編譯及產生 ) */
        const validClasses: string[] = []

        await Promise.all(
            latentClasses
                .map(async (eachLatentClass) => {
                    const validRules = generateValidRules(eachLatentClass, this.css)
                    if (validRules.length) {
                        for (const validRule of validRules) {
                            validRule.layer.insert(validRule)
                        }
                        validClasses.push(eachLatentClass)
                        this.validClasses.add(eachLatentClass)
                    } else {
                        this.invalidClasses.add(eachLatentClass)
                    }
                })
        )
        time = process.hrtime(time)
        const spent = Math.round(((time[0] * 1e9 + time[1]) / 1e6) * 10) / 10
        if (this.css.definedRules.length && validClasses.length) {
            if (this.options.verbose) {
                log.ok`**${path.relative(this.cwd, source)}** ${validClasses.length} classes inserted ${log.chalk.gray('in')} ${spent}ms ${this.options.verbose > 1 ? validClasses : ''}`
            }
            this.emit('change')
        }
        return true
    }

    insertFile(source: string) {
        return this.insert(source, fs.readFileSync(path.resolve(this.cwd, source), { encoding: 'utf-8' }).toString())
    }

    insertFiles(sources: string[]) {
        return Promise.all(sources.map((eachRelPaths) => this.insertFile(eachRelPaths)))
    }

    export(filename = this.options.module as string) {
        const filepath = path.resolve(this.cwd, filename)
        const dir = path.dirname(filepath)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        fs.writeFileSync(filepath, this.css.text)
        if (this.options.verbose) {
            //log.success`${this.css.definedRules.length} rules exported ${log.chalk.gray('in')} **${filename}**`
        }
        this.emit('export', filename, filepath)
    }

    async watchSource(paths: string | string[], watchOptions?: ChokidarOptions): Promise<void> {
        await this.watch('add change', paths, (source) => this.insertFile(source), watchOptions)
    }

    async watch(events: string, paths: string | string[], handle: (path: string, stats?: Stats | undefined) => void, watchOptions?: ChokidarOptions): Promise<void> {
        watchOptions = extend({ ignoreInitial: true, cwd: this.cwd }, watchOptions)
        const watcher = chokidar.watch(paths, watchOptions)
        this.watchers.push(watcher)
        events
            .split(' ')
            .forEach((eachEvent) => watcher.on(eachEvent, handle as never))
        await new Promise<void>(resolve => {
            watcher.once('ready', resolve)
        })
    }

    async startWatch(options: { emit?: boolean } = { emit: true }) {
        if (this.watching) return
        const resolvedConfigPath = this.resolvedConfigPath
        const resolvedOptionsPath = this.resolvedOptionsPath

        if (this.options.sources?.length) {
            await this.watchSource(this.options.sources)
        }

        if (resolvedConfigPath) {
            await this.watch('add change unlink', resolvedConfigPath, async () => {
                if (this.options.verbose) {
                    //log``
                    //log`[change] **${this.configPath}**`
                }
                await this.reset()
                this.emit('configChange')
            })
        }

        if (resolvedOptionsPath) {
            await this.watch('add change unlink', resolvedOptionsPath, async () => {
                if (this.options.verbose) {
                    //log``
                    //log`[change] **${this.customOptions}**`
                    console.log(`[change] **${this.customOptions}**`)
                }
                await this.reset()
                this.emit('optionsChange')
            })
        }
        this.watching = true
        if (options?.emit) this.emit('watchStart')
    }

    async closeWatch(options: { emit?: boolean } = { emit: true }) {
        if (!this.watching) return
        if (this.watchers.length) {
            await Promise.all(this.watchers.map(eachWatcher => eachWatcher.close()))
            this.watchers = []
        }
        this.watching = false
        if (options?.emit) this.emit('watchClose')
    }

    /**
     * computed from `options.sources`
     */
    get fixedSourcePaths(): string[] {
        const { sources } = this.options
        return sources?.length
            ? explorePathsSync(sources, { cwd: this.cwd })
                .filter((eachSourcePath) => !!eachSourcePath)
            : []
    }

    /**
     * resolved from `fixedSourcePaths`
     */
    get resolvedFixedSourcePaths(): string[] {
        return this.fixedSourcePaths.map((eachSourcePath) => path.resolve(this.cwd, eachSourcePath))
    }

    /**
     * `options.include` - `options.exclude`
     */
    get allowedSourcePaths(): string[] {
        const { include, exclude } = this.options
        return include?.length
            ? explorePathsSync(include, { cwd: this.cwd, ignore: exclude })
                .filter((eachSourcePath) => Boolean(eachSourcePath))
            : []
    }

    /**
     * resolved from `allowedSourcePaths`
     */
    get resolvedAllowedSourcePaths(): string[] {
        return this.allowedSourcePaths.map((eachSourcePath) => path.resolve(this.cwd, eachSourcePath))
    }

    isSourceAllowed(source: string): boolean {
        /* remove if params exists */
        if (source.includes('?')) {
            source = source.split('?')[0]
        }
        const { include, exclude, sources } = this.options
        if (sources)
            for (const eachSource of sources) {
                if (minimatch(source, eachSource, { dot: true })) return true
            }
        if (include)
            for (const eachIncludePattern of include) {
                if (!minimatch(source, eachIncludePattern, { dot: true })) return false
            }
        if (exclude)
            for (const eachExcludePattern of exclude) {
                if (minimatch(source, eachExcludePattern, { dot: true })) return false
            }
        return true
    }

    /**
     * computed from `options.config`
     */
    get config(): Config {
        return this.css.config
    }

    /**
     * computed from string `options.config`
    */
    get configPath(): string | undefined {
        if (typeof this.options.config === 'string') {
            // try to find the config file with the given name and options.extensions
            let foundConfigPath: string | undefined
            let foundBasename: string | undefined
            for (const eachExtension of ['js', 'mjs', 'ts', 'cjs', 'cts', 'mts']) {
                const eachBasename = this.options.config + '.' + eachExtension
                const eachPath = resolve(this.cwd || '', eachBasename)
                if (existsSync(eachPath)) {
                    foundConfigPath = eachPath
                    foundBasename = eachBasename
                    break
                }
            }
            return foundBasename
        }
    }

    /**
     * computed from string `options.config`
    */
    get resolvedConfigPath(): string | undefined {
        const configPath = this.configPath
        if (configPath) {
            return path.resolve(this.cwd, configPath)
        }
    }

    /**
     * computed from string `customOptions`
    */
    get optionsPath(): string | undefined {
        if (typeof this.customOptions === 'string') {
            // try to find the config file with the given name and options.extensions
            let foundConfigPath: string | undefined
            let foundBasename: string | undefined
            for (const eachExtension of ['js', 'mjs', 'ts', 'cjs', 'cts', 'mts']) {
                const eachBasename = this.customOptions + '.' + eachExtension
                const eachPath = resolve(this.cwd || '', eachBasename)
                if (existsSync(eachPath)) {
                    foundConfigPath = eachPath
                    foundBasename = eachBasename
                    break
                }
            }
            return foundBasename
        }
    }

    /**
     * computed from string `customOptions`
    */
    get resolvedOptionsPath(): string | undefined {
        const optionsPath = this.optionsPath
        if (optionsPath) {
            return path.resolve(this.cwd, optionsPath)
        }
    }

    get resolvedVirtualModuleId(): string {
        return '\0' + this.options.module
    }

    get slotCSSRule(): string {
        return '#' + cssEscape(this.options.module as string) + '{--slot:0}'
    }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export default interface CSSExtractor {
    css: MasterCSS
    options: Options
}