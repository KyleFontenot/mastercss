import MasterCSS from './core'

export class Rule {
    constructor(
        public readonly name: string,
        public css: MasterCSS,
        public nodes: RuleNode[] = []
    ) { }

    get key(): string {
        return this.name
    }

    get text(): string {
        return this.nodes.map(({ text }) => text).join('')
    }
}

export interface RuleNode {
    text: string
    native?: CSSRule
}
