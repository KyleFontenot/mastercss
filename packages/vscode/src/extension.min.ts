import path from 'path'
import * as vscode from 'vscode'
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node'

let client: LanguageClient

const disposables: Disposable[] = []

export function activate(context: vscode.ExtensionContext) {

    // The server is implemented in node
    const serverModule = context.asAbsolutePath(path.join('dist', 'server.min.cjs'))

    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6010'] }

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions
        }
    }

    const includedLanguages = vscode.workspace.getConfiguration('masterCSS').includedLanguages
    const Languages: { scheme: 'file', language: string }[] = []
    includedLanguages.forEach((x: any) => {
        Languages.push({ scheme: 'file', language: x })
    })

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        // Register the server for html documents
        documentSelector: Languages,
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
        }
    }

    // Create the language client and start the client.
    client = new LanguageClient(
        'masterCSS',
        'Master CSS',
        serverOptions,
        clientOptions
    )

    // Start the client. This will also launch the server
    client.start()
}

export function deactivate(): Thenable<void> | undefined {
    unregisterProviders(disposables)

    if (!client) {
        return undefined
    }
    return client.stop()
}

function unregisterProviders(disposables: Disposable[]) {
    disposables.forEach(disposable => disposable?.[Symbol.dispose]())
    disposables.length = 0
}

function dedupe(arg0: any[]) {
    throw new Error('Function not implemented.')
}

