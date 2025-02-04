import type { ColorInformation } from 'vscode-languageserver-protocol'
import { instancePattern } from '../utils/regex'
import CSSLanguageService from '../core'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import { parse as parseColorToken, converter, type Color, type Rgb } from 'culori'
import { SyntaxRuleType, type ValueComponent } from '@master/css'

export default async function renderSyntaxColors(this: CSSLanguageService, document: TextDocument): Promise<ColorInformation[] | undefined> {
    const text = document.getText() ?? ''
    const colorInformations: ColorInformation[] = []
    for (const instanceMatch of text.matchAll(instancePattern)) {
        if (instanceMatch.index === undefined) break
        const instanceStartIndex = instanceMatch.index
        const syntax = instanceMatch[0]
        const rule = this.css.generate(syntax)[0]
        if (rule && rule.type !== SyntaxRuleType.Utility) {
            const keyTokenLength = rule.keyToken?.length ?? 0
            let currentLength = 0
            const resolveValueComponent = (valueComponent: ValueComponent) => {
                if (valueComponent.text === undefined) return  // text is always existing, just for type
                const startOffset = instanceStartIndex + keyTokenLength + currentLength
                // TODO: check number mt:30
                const valueComponentTokenLength = valueComponent.token.length
                let color: Color | undefined
                switch (valueComponent.type) {
                    case 'function':
                        if (['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color'].includes(valueComponent.name)) {
                            color = parseColorToken(valueComponent.text)
                        } else if (valueComponent.children.length) {
                            currentLength += valueComponent.name.length + 1 // function name + '('
                            valueComponent.children.forEach(resolveValueComponent)
                        }
                        break
                    case 'variable':
                        if (valueComponent.variable?.type === 'color') {
                            color = parseColorToken(valueComponent.text)
                        }
                        break
                    case 'string':
                        if (valueComponent.text !== '#' && valueComponent.text?.startsWith('#')) {
                            color = parseColorToken(valueComponent.text)
                        }
                        break
                }
                // check if rgba is valid
                if (color) {
                    const rgbaColor = color.mode !== 'rgb' ? converter('rgb')(color) : color as Rgb
                    colorInformations.push({
                        range: {
                            start: document.positionAt(startOffset),
                            end: document.positionAt(startOffset + valueComponentTokenLength)
                        },
                        color: {
                            red: rgbaColor.r,
                            green: rgbaColor.g,
                            blue: rgbaColor.b,
                            alpha: rgbaColor.alpha === undefined ? 1 : rgbaColor.alpha
                        }
                    })
                }
                currentLength += valueComponentTokenLength || 0
            }
            rule.valueComponents.forEach(resolveValueComponent)
        }
    }

    const colorIndexSet = new Set()
    return colorInformations.filter(item => {
        if (colorIndexSet.has(item.range.start)) {
            return false
        } else {
            colorIndexSet.add(item.range.start)
            return true
        }
    })
}
