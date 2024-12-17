import { it, test, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import cssEscape from 'shared/utils/css-escape'
import puppeteer, { type Browser, type Page } from 'puppeteer-core'
import { copy, rm } from 'shared/utils/fs'
import { SpawndChildProcess, spawnd } from 'spawnd'
import waitForDataMatch from 'shared/utils/wait-for-data-match'
import delay from 'shared/utils/delay'

test.todo('vite dev tests timeout in CI')
if (!process.env.GITHUB_ACTIONS) {
    const examplePath = path.join(__dirname, '../../../../examples/vite-with-static-extraction')
    const tmpDir = path.join(__dirname, 'tmp/dev')

    let devProcess: SpawndChildProcess
    let browser: Browser
    let page: Page
    let error: Error
    let templatePath: string
    let templateContent: string
    let masterCSSConfigPath: string

    beforeAll(async () => {
        copy(examplePath, tmpDir)
        templatePath = path.join(tmpDir, 'index.html')
        templateContent = fs.readFileSync(templatePath).toString()
        masterCSSConfigPath = path.join(tmpDir, 'master.css.ts')
        devProcess = spawnd('pnpm dev --port 4005', { shell: true, cwd: tmpDir })
        const urlPattern = /(http:\/\/localhost:).*?([0-9]+)/
        const data = await waitForDataMatch(devProcess, (data) => urlPattern.exec(data)?.length)
        const result = urlPattern.exec(data)
        browser = await puppeteer.launch({ channel: 'chrome' })
        page = await browser.newPage()
        page.on('console', (consoleMessage) => {
            if (consoleMessage.type() === 'error') {
                error = new Error(consoleMessage.text())
            }
        })
        page.on('pageerror', (e) => error = e)
        page.on('error', (e) => error = e)
        if (result) {
            await page.goto(result[1] + result[2])
        }
    }, 60000)

    it('run dev without errors', () => {
        expect(() => { if (error) throw error }).not.toThrow()
    }, 60000)

    it('check if the page contains [data-vite-dev-id=".virtual/master.css"]', async () => {
        expect(await page.$('[data-vite-dev-id$=".virtual/master.css"]')).toBeTruthy()
    }, 60000)

    it('change class names and check result in the browser during HMR', async () => {
        const newClassName = 'font:' + new Date().getTime()
        const newClassNameSelector = '.' + cssEscape(newClassName)
        fs.writeFileSync(templatePath, templateContent.replace('class="card"', `class="${newClassName}"`))
        await page.waitForNetworkIdle()
        const cssText = await page.evaluate(() => document.querySelector('[data-vite-dev-id$=".virtual/master.css"]')?.textContent)
        expect(cssText).toContain(newClassNameSelector)
    }, 60000)

    it('change master.css.ts and check result in the browser during HMR', async () => {
        const newBtnClassName = 'btn' + new Date().getTime()
        const newBtnClassNameSelector = '.' + cssEscape(newBtnClassName)
        fs.writeFileSync(templatePath, templateContent.replace('class="card"', `class="${newBtnClassName}"`))
        fs.writeFileSync(masterCSSConfigPath, `
            export default { styles: { '${newBtnClassName}': 'bg:black' } }
        `)
        await page.waitForNetworkIdle()
        const cssText = await page.evaluate(() => document.querySelector('[data-vite-dev-id$=".virtual/master.css"]')?.textContent)
        expect(cssText).toContain(newBtnClassNameSelector)
    }, 60000)

    afterAll(async () => {
        await page.close()
        await browser.close()
        await devProcess.destroy()
    }, 60000)
}