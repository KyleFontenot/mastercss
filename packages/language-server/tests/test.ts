import { resolve } from 'path'
import { withFixture } from './setup'
import { test } from 'vitest'

withFixture('basic', async (context) => {
    test.concurrent('root workspace', async ({ expect }) => {
        expect(context.server.workspaces.length).toBe(1)
        expect(context.server.workspaces[0].uri).toBe(context.rootUri)
    })

    test('open and close a document', async ({ expect }) => {
        const textDocument = context.createDocument()
        await context.server.onDidOpen({ document: textDocument })
        expect(context.rootWorkspace?.openedTextDocuments?.length).toBe(1)
        expect(context.rootWorkspace?.openedTextDocuments).toEqual([textDocument])
        await context.server.onDidClose({ document: textDocument })
        expect(context.rootWorkspace?.openedTextDocuments?.length).toBe(0)
    })

    test('open an external document', async ({ expect }) => {
        const dir = resolve(__dirname, './external')
        const textDocument = context.createDocument('', { dir })
        await context.server.onDidOpen({ document: textDocument })
        expect(context.rootWorkspace?.openedTextDocuments?.length).toBe(1)
        expect(context.rootWorkspace?.openedTextDocuments).toEqual([textDocument])
        await context.server.onDidClose({ document: textDocument })
        expect(context.rootWorkspace?.openedTextDocuments?.length).toBe(0)
    })
})

