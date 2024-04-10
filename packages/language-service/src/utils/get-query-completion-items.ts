import { AT_SIGN, MasterCSS, QUERY_COMPARISON_OPERATORS, QUERY_LOGICAL_OPERATORS, generateCSS } from '@master/css'
import { CompletionItem, CompletionItemKind, InsertTextFormat } from 'vscode-languageserver-protocol'
import sortCompletionItems from './sort-completion-items'
import { getCSSDataDocumentation } from './get-css-data-documentation'
import cssDataProvider from './css-data-provider'

export default function getQueryCompletionItems(css: MasterCSS = new MasterCSS(), triggerCharacter = AT_SIGN, syntax: string): CompletionItem[] {
    const atDataList = cssDataProvider.provideAtDirectives()
    const completionItems: CompletionItem[] = []
    if (!QUERY_COMPARISON_OPERATORS.includes(triggerCharacter)) {
        completionItems.push(
            {
                label: triggerCharacter + 'media()',
                filterText: 'media()',
                insertText: 'media()',
                sortText: 'media()',
                documentation: getCSSDataDocumentation(atDataList.find(({ name }) => name === '@media'), {
                    generatedCSS: generateCSS([syntax + 'media()'], css),
                    docs: 'queries'
                }),
            },
            {
                label: triggerCharacter + 'supports()',
                filterText: 'supports()',
                insertText: 'supports()',
                sortText: 'supports()',
                documentation: getCSSDataDocumentation(atDataList.find(({ name }) => name === '@supports'), {
                    generatedCSS: generateCSS([syntax + 'supports()'], css),
                    docs: 'queries'
                }),
            }
        )
    }
    Object.entries(css.queries)
        .forEach(([name, value]) => {
            const completionItem: Omit<CompletionItem, 'label'> = {
                filterText: name,
                insertText: name,
                documentation: getCSSDataDocumentation(undefined, {
                    generatedCSS: generateCSS([syntax + name], css),
                    docs: 'queries'
                })
            }
            if ([AT_SIGN, ...QUERY_LOGICAL_OPERATORS].includes(triggerCharacter)) {
                if (typeof value === 'number') {
                    completionItems.push({
                        ...completionItem,
                        label: triggerCharacter + name,
                        sortText: String(value).padStart(8, '0'),
                        filterText: name,
                        insertText: name,
                        documentation: getCSSDataDocumentation(undefined, {
                            generatedCSS: generateCSS([syntax + name], css),
                            docs: 'queries'
                        }),
                        detail: `screen width ${'>='} ${value}px`,
                        kind: CompletionItemKind.Keyword
                    })
                } else {
                    completionItems.push(
                        {
                            ...completionItem,
                            label: triggerCharacter + name,
                            detail: value,
                            sortText: name,
                            kind: CompletionItemKind.Keyword,
                        }
                    )
                }
            } else if (QUERY_COMPARISON_OPERATORS.includes(triggerCharacter)) {
                if (typeof value === 'number') {
                    const prevComparisonCharacter = syntax.charAt(syntax.length - 2)
                    const comparisonCharacter = prevComparisonCharacter === '>' || prevComparisonCharacter === '<'
                        ? prevComparisonCharacter + triggerCharacter
                        : triggerCharacter
                    completionItems.push({
                        ...completionItem,
                        label: comparisonCharacter + name,
                        sortText: comparisonCharacter + String(value).padStart(8, '0'),
                        filterText: name,
                        insertText: name,
                        documentation: getCSSDataDocumentation(undefined, {
                            generatedCSS: generateCSS([syntax + name], css),
                            docs: 'queries'
                        }),
                        detail: `screen width ${comparisonCharacter} ${value}px`,
                        kind: CompletionItemKind.Keyword
                    })
                }
            }
        })
    return sortCompletionItems(completionItems)
}