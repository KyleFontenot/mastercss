import { rmSync, mkdirSync, readdirSync, statSync, copyFileSync, RmOptions } from 'fs'
import { join } from 'path'

export function rm(targetPath: string, options?: RmOptions) {
    rmSync(targetPath, { recursive: true, force: true, ...options })
}

export function mkdir(targetPath: string, options?: any) {
    mkdirSync(targetPath, { recursive: true, ...options })
}

export function copy(sourceDir: string, destinationDir: string) {
    rm(destinationDir)
    mkdir(destinationDir)
    const items = readdirSync(sourceDir)
    for (const item of items) {
        if ([
            'dist',
            'out',
            '.bin',
            '.nuxt',
            '.next',
            '.output',
            'node_modules'
        ].includes(item)) {
            continue
        }
        const sourcePath = join(sourceDir, item)
        const destinationPath = join(destinationDir, item)
        const stat = statSync(sourcePath)
        if (stat.isDirectory()) {
            copy(sourcePath, destinationPath)
        } else {
            copyFileSync(sourcePath, destinationPath)
        }
    }
}