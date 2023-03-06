export const inset = {
    matches: '^(?:top|bottom|left|right):.',
    get(declaration): { [key: string]: any } {
        return {
            [this.prefix.slice(0, -1)]: declaration
        }
    }
}