import path from 'path'
import { execSync } from 'child_process'
import { copy, rm } from 'shared/utils/fs'
import fs from 'fs'
import { explorePathSync } from '@techor/glob'

const examplePath = path.join(__dirname, '../../../../examples/react-with-static-extraction')
const tmpDir = path.join(__dirname, 'tmp/build')

test.todo(`Error: Cannot find module '../lib/tsc.js'`)
test.skip('build', () => {
    copy(examplePath, tmpDir)
    execSync('pnpm run build', { cwd: tmpDir })
    expect(fs.readFileSync(explorePathSync(path.resolve(tmpDir, 'dist/assets/index-*.css'))).toString()).toContain('font\\:heavy')
    rm(tmpDir)
})