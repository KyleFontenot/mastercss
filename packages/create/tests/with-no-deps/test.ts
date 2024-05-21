import { test, it, expect, beforeAll } from 'vitest'
import { execSync } from 'child_process'
import { join } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
import { rm, mkdir } from 'shared/utils/fs'

beforeAll(() => {
    rm(join(__dirname, 'dist'))
    mkdir(join(__dirname, 'dist'))
    writeFileSync(join(__dirname, './dist/package.json'), JSON.stringify({
        'name': 'with-package-json.test',
        'private': true
    }))
})

it('init', () => {
    // MacOS and Windows -> error https://registry.yarnpkg.com/@master/css/-/css-2.0.0-rc.21.tgz: Extracting tar content of undefined failed, the file appears to be corrupt: "ENOENT: no such file or directory, chmod '/Users/runner/Library/Caches/Yarn/v6/npm-@master-css-2.0.0-rc.21-95d553b31c3370f41a9c60815841f3c359f95bcc-integrity/node_modules/@master/css/README.md'"
    if (!process.env.CI || process.env.RUNNER_OS === 'Linux') {
        execSync('tsx ../../../src/bin', { cwd: join(__dirname, 'dist')})
        expect(JSON.parse(readFileSync(join(__dirname, './dist/package.json'), 'utf-8')).dependencies['@master/css']).toBeDefined()
    }
})