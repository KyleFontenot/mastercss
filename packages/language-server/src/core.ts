import { createConnection, TextDocuments, InitializeParams, WorkspaceFolder, Disposable, Connection, ClientCapabilities, TextDocumentChangeEvent, DidChangeConfigurationParams, HoverParams, CompletionParams, DocumentColorParams, ColorPresentationParams, RemoteConsole } from 'vscode-languageserver/node'
import { TextDocument } from 'vscode-languageserver-textdocument'
import path from 'node:path'
import CSSLanguageService, { Settings as CSSLanguageServiceSettings } from '@master/css-language-service'
import { Settings } from './settings'
import exploreConfig from '@master/css-explore-config'
import extend from '@techor/extend'
import settings from './settings'
import { Config } from '@master/css'
import { SERVER_CAPABILITIES } from '@master/css-language-service'
import glob from 'fast-glob'
import { URI } from 'vscode-uri'

export declare type Workspace = {
    path: string
    uri: string
    openedTextDocuments: TextDocument[]
    languageService?: CSSLanguageService
    languageServiceSettings: CSSLanguageServiceSettings
}

export default class CSSLanguageServer {
    workspaceFolders: WorkspaceFolder[] = []
    workspaces: Workspace[] = []
    documents: TextDocuments<TextDocument>
    initializing?: Promise<void>
    clientCapabilities: ClientCapabilities = {}
    settings?: Settings
    console: RemoteConsole
    private disposables: Disposable[] = []

    constructor(
        public connection: Connection = process.argv.includes('--stdio')
            ? createConnection(process.stdin, process.stdout)
            : createConnection(),
        public customSettings?: Settings
    ) {
        this.documents = new TextDocuments(TextDocument)
        this.settings = extend(settings, this.customSettings) as Settings
        this.console = new Proxy(this.connection.console, {
            get: (target, prop: keyof RemoteConsole) => {
                if (!this.settings?.verbose) return () => { }
                return this.connection.console[prop]
            }
        })
    }

    start() {
        this.disposables.push(
            this.documents.onDidSave(this.onDidSave.bind(this)),
            this.documents.onDidOpen(this.onDidOpen.bind(this)),
            this.documents.onDidClose(this.onDidClose.bind(this)),
            this.documents.listen(this.connection),
            this.connection.onDidChangeConfiguration(this.onDidChangeConfiguration.bind(this)),
            this.connection.onHover(this.onHover.bind(this)),
            this.connection.onCompletion(this.onCompletion.bind(this)),
            this.connection.onDocumentColor(this.onDocumentColor.bind(this)),
            this.connection.onColorPresentation(this.onColorPresentation.bind(this)),
            this.connection.onInitialize(this.onInitialize.bind(this)),
            this.connection.onInitialized(() => this.init())
        )
        this.connection.listen()
    }

    init() {
        if (this.initializing) return this.initializing
        // eslint-disable-next-line no-async-promise-executor
        return this.initializing = new Promise(async (resolve) => {
            await Promise.all(this.workspaceFolders.map((folder) => this.initWorkspaceFolder(folder.uri)))
            resolve()
        })
    }

    onInitialize(params: InitializeParams) {
        this.clientCapabilities = params.capabilities
        if (params.workspaceFolders?.length) {
            this.workspaceFolders = params.workspaceFolders
        } else {
            /**
             * @deprecated — in favour of workspaceFolders
             */
            if (params.rootUri) {
                this.workspaceFolders.push({ name: '', uri: params.rootUri })
            }
        }
        return {
            capabilities: SERVER_CAPABILITIES
        }
    }

    async onHover(params: HoverParams) {
        await this.init()
        const workspace = this.findClosestWorkspace(params.textDocument.uri)
        if (workspace.languageService) {
            const document = this.documents.get(params.textDocument.uri)
            if (document) return workspace.languageService.inspectSyntax(document, params.position)
        }
    }

    async onCompletion(params: CompletionParams) {
        await this.init()
        const workspace = this.findClosestWorkspace(params.textDocument.uri)
        if (workspace.languageService) {
            const document = this.documents.get(params.textDocument.uri)
            if (document) return workspace.languageService.suggestSyntax(document, params.position, params.context)
        }
    }

    async onDocumentColor(params: DocumentColorParams) {
        await this.init()
        const workspace = this.findClosestWorkspace(params.textDocument.uri)
        if (workspace.languageService) {
            const document = this.documents.get(params.textDocument.uri)
            if (document) return workspace.languageService.renderSyntaxColors(document)
        }
    }

    async onColorPresentation(params: ColorPresentationParams) {
        await this.init()
        const workspace = this.findClosestWorkspace(params.textDocument.uri)
        if (workspace.languageService) {
            const document = this.documents.get(params.textDocument.uri)
            if (document) return workspace.languageService.editSyntaxColors(document, params.color, params.range)
        }
    }

    async onDidOpen(params: TextDocumentChangeEvent<TextDocument>) {
        await this.init()
        const workspace = this.findClosestWorkspace(params.document.uri)
        if (!workspace || workspace.openedTextDocuments.includes(params.document)) return
        if (!workspace.openedTextDocuments.length) {
            this.initLanguageService(workspace)
        }
        workspace.openedTextDocuments.push(params.document)
    }

    async onDidClose(params: TextDocumentChangeEvent<TextDocument>) {
        await this.init()
        const workspace = this.findClosestWorkspace(params.document.uri)
        if (!workspace) return
        workspace.openedTextDocuments.splice(workspace.openedTextDocuments.indexOf(params.document), 1)
        if (!workspace.openedTextDocuments.length) {
            this.destroyLanguageService(workspace)
        }
    }

    async onDidSave(params: TextDocumentChangeEvent<TextDocument>) {
        await this.init()
        const workspace = this.findClosestWorkspace(params.document.uri)
        if (!workspace) return
        const name = path.parse(params.document.uri).name
        if (name === 'master.css' || name.endsWith('.css')) {
            this.connection.sendRequest('masterCSS/restart', {
                title: 'Updating Master CSS configuration',
            })
        }
    }

    async onDidChangeConfiguration({ settings }: DidChangeConfigurationParams) {
        await this.init()
        if (settings?.masterCSS) {
            this.connection.sendNotification('masterCSS/globalSettingsChanged', settings.masterCSS)
            this.customSettings = settings.masterCSS
            this.connection.sendRequest('masterCSS/restart', {
                title: 'Updating Master CSS settings',
            })
        }
    }

    private async initWorkspaceFolder(workspaceFolderURI: string) {
        const workspaceFolderCWD = path.resolve(URI.parse(workspaceFolderURI).fsPath)
        let customWorkspaceFolderSettings: Settings | undefined
        if (this.clientCapabilities.workspace?.configuration) {
            customWorkspaceFolderSettings = await this.connection.workspace.getConfiguration({
                scopeUri: workspaceFolderURI,
                section: 'masterCSS'
            }) as Settings
        }
        const { workspaces, ...languageServiceSettings } = extend(settings, this.customSettings, customWorkspaceFolderSettings) as Settings
        const resolvedWorkspaceDirectories = new Set<string>([workspaceFolderCWD])
        this.console.info(`Registered workspace folder ${workspaceFolderURI}`)
        if (workspaces === 'auto') {
            (await glob('**/master.css.*', {
                cwd: workspaceFolderCWD,
                absolute: true,
                onlyFiles: true,
                ignore: ['**/node_modules/**']
            }))
                .forEach((workspaceFile) => resolvedWorkspaceDirectories.add(path.dirname(workspaceFile)))
        } else if (workspaces?.length) {
            (await glob(workspaces, {
                cwd: workspaceFolderCWD,
                absolute: true,
                onlyDirectories: true,
                ignore: ['**/node_modules/**']
            }))
                .forEach((workspaceDir) => resolvedWorkspaceDirectories.add(workspaceDir))
        }
        resolvedWorkspaceDirectories.forEach(async (workspaceDir) => {
            const workspaceURI = URI.file(workspaceDir).toString()
            this.console.info(`Added workspace ${workspaceURI}`)
            this.workspaces.push({
                path: workspaceDir,
                uri: workspaceURI,
                openedTextDocuments: [],
                languageServiceSettings
            })
        })
    }

    initLanguageService(workspace: Workspace) {
        let workspaceConfig: Config | undefined
        try {
            workspaceConfig = exploreConfig({
                cwd: workspace.path,
                found: undefined
            })
        } catch (e: any) {
            this.console.info(`Failed to load config from ${workspace}`)
            this.console.error(e)
        }
        this.console.info(`Initialized workspace ${workspaceConfig ? '(with config file)' : ''} ${workspace.uri}`)
        workspace.languageService = new CSSLanguageService({ ...workspace.languageServiceSettings, config: workspaceConfig })
    }

    destroyLanguageService(workspace: Workspace) {
        this.console.info(`Destroyed workspace ${workspace.uri}`)
        delete workspace.languageService
    }

    findClosestWorkspace(textDocumentURI: string) {
        let foundWorkspace: Workspace | undefined
        for (const workspace of this.workspaces) {
            if (textDocumentURI.startsWith(workspace.uri) && (!foundWorkspace || workspace.uri.length > foundWorkspace.uri.length)) {
                foundWorkspace = workspace
            }
        }
        if (process.env.DEBUG && !foundWorkspace) {
            this.console.info(`This is an external document ${textDocumentURI} assigned to the first workspace`)
        }
        return foundWorkspace || this.workspaces[0]
    }

    getWorkspace(uri: string) {
        return Array.from(this.workspaces).find((workspace) => workspace.uri === uri)
    }

    stop(): void {
        this.connection.sendNotification('masterCSS/dispose')
        this.disposables.forEach((disposable) => disposable.dispose())
        this.disposables.length = 0
        this.connection.dispose()
        this.initializing = undefined
    }
}