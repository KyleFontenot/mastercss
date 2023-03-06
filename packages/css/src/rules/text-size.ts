const diff = .75

export const textSize = {
    matches: '^t(?:ext)?:(?:\\.?[0-9]|(?:max|min|calc|clamp)\\(.*\\)|$values)[^|]*$',
    prop: false,
    get(declaration): { [key: string]: any } {
        const { unit, value } = declaration
        return {
            'font-size': declaration,
            'line-height': {
                ...declaration,
                value: unit === 'em'
                    ? value + diff + unit
                    : `calc(${value}${unit} + ${diff}em)`,
                unit: ''
            }
        }
    }
}