import { execSync } from 'child_process'
import fs, { readFileSync } from 'fs'
import { join } from 'path'
import { it, expect } from 'vitest'

it('basic extract', async () => {
    fs.rmSync(join(__dirname, '.virtual/master.css'), { force: true })
    fs.writeFileSync(join(__dirname, 'master.css.ts'), `
        export default {
            variables: {
                primary: '$(blue)'
            }
        }
    `, { flag: 'w' })
    execSync('tsx ../../src/bin extract', { cwd: __dirname })
    expect(readFileSync(join(__dirname, '.virtual/master.css')).toString()).toMatch(/(fg\\:primary|m\\:12x|text\\:center|font\\:sans|font\\:heavy|font\\:48)/)
})