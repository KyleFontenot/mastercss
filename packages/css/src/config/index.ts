import viewports from './viewports'
import colors from './colors'
import selectors from './selectors'
import semantics from './semantics'
import animations from './animations'
import variables from './variables'
import rules from './rules'
import functions from './functions'
import fonts from './fonts'
import { CSSDeclarations } from '../types/css-declarations'
import type { Rule } from '../rule'
import type { MasterCSS } from '../core'
import { CoreLayer, Layer } from '../layer'

const config: Config = {
    viewports,
    colors,
    selectors,
    semantics,
    rules,
    fonts,
    functions,
    animations,
    variables,
    scope: '',
    rootSize: 16,
    override: false,
    important: false,
    themeDriver: 'class'
}

export {
    config,
    viewports,
    colors,
    selectors,
    semantics,
    rules,
    fonts,
    functions,
    animations,
    variables
}

type ExtendedValues = { [key: string]: string | number | ExtendedValues }

export interface RuleConfig {
    id?: string
    match?: RegExp | [string, string[]?]
    _resolvedMatch?: RegExp
    _variables?: any
    variables?: Record<string, string | number> | Array<string | number | Record<string, string | number>>
    order?: number
    separators?: string[]
    colored?: boolean
    numeric?: boolean
    unit?: any
    native?: boolean
    _semantic?: boolean
    _declarations?: CSSDeclarations
    _propName?: string
    layer?: Layer | CoreLayer,
    analyze?(this: Rule, className: string): [valueToken: string, prefixToken?: string]
    transform?(this: Rule, value: string): string
    declare?(this: Rule, value: string, unit: string): CSSDeclarations
    delete?(this: Rule, className: string): void
    create?(this: Rule, className: string): void
    insert?(this: Rule): void
}

export interface Config {
    extends?: (Config | { config: Config })[]
    styles?: { [key: string]: string | Config['styles'] }
    colors?: { [key: string]: string | Config['colors'] }
    viewports?: { [key: string]: number | Config['viewports'] }
    mediaQueries?: { [key: string]: string | Config['mediaQueries'] }
    selectors?: { [key: string]: string | string[] | Config['selectors'] }
    semantics?: { [key in keyof typeof semantics]?: CSSDeclarations } & { [key: string]: CSSDeclarations }
    variables?: { [key in keyof typeof rules]?: number | string | { [key: string]: number | string } } & { [key: string]: number | string | { [key: string]: number | string } }
    fonts?: { [key: string]: string | string[] } | ((css: MasterCSS) => Config['fonts'])
    rules?: { [key in keyof typeof rules]?: RuleConfig } & { [key: string]: RuleConfig }
    rootSize?: number
    scope?: string
    important?: boolean
    override?: boolean
    functions?: Record<string, {
        unit?: string
        colored?: boolean
        transform?(this: Rule, opening: string, value: string, closing: string): string
    }>,
    animations?: Record<string, { [key in 'from' | 'to']?: CSSDeclarations } & { [key: string]: CSSDeclarations }>
    themeDriver?: 'class' | 'media' | 'host'
}