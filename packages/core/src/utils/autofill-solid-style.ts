import { BORDER_STYLE_VALUES } from '../common'
import { RuleDefinition } from '../rule'

const autofillSolidStyle: RuleDefinition['transformValueComponents'] = function (valueComponents) {
    if (valueComponents.length < 2) return valueComponents
    let styleIncluded = false
    let varIncluded = false
    for (const valueComponent of valueComponents) {
        if (
            valueComponent.type === 'string' && BORDER_STYLE_VALUES.includes(valueComponent.value)
            || valueComponent.type === 'variable' && BORDER_STYLE_VALUES.includes(String(valueComponent.variable?.value))
        ) {
            styleIncluded = true
        }
        if (valueComponent.type === 'function' && valueComponent.name === 'var') {
            varIncluded = true
        }
    }
    if (!styleIncluded && !varIncluded) {
        valueComponents.push(
            { type: 'separator', value: ' ', token: '|' },
            { type: 'string', value: 'solid', token: 'solid' }
        )
    }
    return valueComponents
}

export default autofillSolidStyle