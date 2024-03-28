import queries from './queries'
import selectors from './selectors'
import utilities from './utilities'
import animations from './animations'
import variables from './variables'
import rules from './rules'
import functions from './functions'
import type { PropertiesHyphen } from 'csstype'
import type { Rule, RuleDefinition, ValueComponent } from '../rule'

const config: Config = {
    queries,
    selectors,
    utilities,
    rules,
    functions,
    animations,
    variables,
    scope: '',
    rootSize: 16,
    baseUnit: 4,
    override: false,
    important: false,
    modeDriver: 'class',
}

export {
    config,
    queries,
    selectors,
    utilities,
    rules,
    functions,
    animations,
    variables
}

export type VariableValue = number | string | Array<number | string>
export type VariableDefinition = { [key in '' | `@${string}` | string]?: VariableValue | VariableDefinition } | VariableValue
export type CSSKeyframes = { [key in 'from' | 'to' | string]: PropertiesHyphen }
export type AnimationDefinitions = { [key: string]: CSSKeyframes }
export type SelectorDefinitions = { [key: string]: string | string[] | SelectorDefinitions }
export type MediaQueryDefinitions = { [key: string]: number | string | MediaQueryDefinitions }
export type StyleDefinitions = { [key: string]: string | StyleDefinitions }
export type RuleDefinitions = { [key in keyof typeof rules | string]?: RuleDefinition }
export type VariableDefinitions = { [key in keyof typeof rules]?: VariableDefinition } & { [key: string]: VariableDefinition }
export type UtilityDefinitions = { [key in keyof typeof utilities]?: PropertiesHyphen } & { [key: string]: PropertiesHyphen }
export interface FunctionDefinition {
    unit?: string
    transform?(this: Rule, value: string, bypassVariableNames: string[]): string | ValueComponent[]
}
export type FunctionDefinitions = { [key: string]: FunctionDefinition }

export interface Config {
    extends?: (Config | any)[]
    styles?: StyleDefinitions
    queries?: MediaQueryDefinitions
    selectors?: SelectorDefinitions
    utilities?: UtilityDefinitions
    variables?: VariableDefinitions
    rules?: RuleDefinitions
    rootSize?: number
    baseUnit?: number
    scope?: string
    important?: boolean
    override?: boolean
    functions?: FunctionDefinitions
    animations?: AnimationDefinitions
    modeDriver?: 'class' | 'media' | 'host'
}