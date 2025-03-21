import convertColorSpace from './convert-color-space'
import type { MasterCSS, ColorVariable } from '@master/css'
import type { ColorPresentationParams } from 'vscode-languageserver-protocol'

export default function convertColorByToken(color: ColorPresentationParams['color'], colorToken: string, css: MasterCSS) {
    const valueComponent = css.generate('color:' + colorToken)[0]?.valueComponents[0]
    let outputColorSpace = 'hex'
    switch (valueComponent?.type) {
        case 'function':
            outputColorSpace = valueComponent.name
            break
        case 'variable':
            outputColorSpace = (valueComponent.variable as ColorVariable)?.space
            break
        case 'string':
            outputColorSpace = 'hex'
            break
    }
    return convertColorSpace({ r: color.red, g: color.green, b: color.blue, alpha: color.alpha, mode: 'rgb' }, outputColorSpace)
}