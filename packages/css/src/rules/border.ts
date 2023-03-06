import { Rule } from '../rule'
import { getBorderProps } from '../utils/get-border-props'

export class Border extends Rule {
    static id = 'Border' as const
    static matches = '^b(?:[xytblr]?|order(?:-(?:left|right|top|bottom))?):.'
    static colorful = true
    static get prop() { return '' }
    override get(declaration): { [key: string]: any } {
        return getBorderProps(this.prefix, declaration)
    }
    override get order(): number {
        return (this.prefix === 'border' + ':' || this.prefix === 'b:') ? -2 : -1
    }
}