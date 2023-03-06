import { analyzeValueToken } from '../utils/analyze-value-token'
import { Rule } from '../rule'

export class MinWH extends Rule {
    static id = 'MinWH' as const
    static matches = '^min:(?:(?:max|min|clamp|calc)\\(.+\\)|[0-9]+[a-z]*?)x(?:(?:max|min|clamp|calc)\\(.+\\)|[0-9]+[a-z]*?)'
    static get prop() { return '' }
    override analyzeToken(token: string, values: Record<string, string | number>, globalValues: Record<string, string | number>): [string, Array<string | { value: string }>, string] {
        return ['', ...analyzeValueToken(token.slice(4), values, globalValues, ['x'])]
    }
    override get(declaration): { [key: string]: any } {
        const [width, height] = declaration.value.split(' x ')
        return {
            'min-width': { ...declaration, value: width },
            'min-height': { ...declaration, value: height }
        }
    }
}