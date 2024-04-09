import { type ServerCapabilities, TextDocumentSyncKind } from 'vscode-languageserver-protocol'
import { AT_SIGN, DELIMITER_SIGN, QUERY_COMPARISON_OPERATORS, QUERY_LOGICAL_OPERATORS, SELECTOR_SIGNS, SEPARATOR_SIGN } from '@master/css'

export const INVOKED_TRIGGER_CHARACTERS = ['"', ' ', '\'']
export const VALUE_TRIGGER_CHARACTERS = [SEPARATOR_SIGN, DELIMITER_SIGN]
export const SELECTOR_TRIGGER_CHARACTERS = SELECTOR_SIGNS
export const AT_TRIGGER_CHARACTER = AT_SIGN
export const QUERY_TRIGGER_CHARACTERS = [...QUERY_COMPARISON_OPERATORS, ...QUERY_LOGICAL_OPERATORS]
export const GROUP_TRIGGER_CHARACTER = '{'

export const SERVER_CAPABILITIES: ServerCapabilities = {
    textDocumentSync: TextDocumentSyncKind.Incremental,
    // Tell the client that this server supports code completion.
    completionProvider: {
        resolveProvider: false,
        workDoneProgress: false,
        triggerCharacters: [
            ...new Set([
                ...INVOKED_TRIGGER_CHARACTERS,
                ...VALUE_TRIGGER_CHARACTERS,
                ...SELECTOR_TRIGGER_CHARACTERS,
                ...QUERY_TRIGGER_CHARACTERS,
                AT_TRIGGER_CHARACTER,
                GROUP_TRIGGER_CHARACTER,
            ])
        ]
    },
    colorProvider: true,
    hoverProvider: true,
    workspace: {
        workspaceFolders: {
            supported: true
        }
    }
}