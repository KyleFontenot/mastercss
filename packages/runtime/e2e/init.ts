import { Config } from '@master/css'
import { Page } from '@playwright/test'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
// @ts-expect-error
import { css_beautify } from 'js-beautify/js/lib/beautify-css.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async function init(page: Page, text: string, config?: Config) {
    await page.evaluate(({ config, text }) => {
        if (config) window.masterCSSConfig = config
        const style = document.createElement('style')
        style.id = 'master'
        style.textContent = text
        document.head.appendChild(style)
    }, { config, text })
    await page.addScriptTag({ path: resolve(__dirname, '../dist/global.min.js') })
}