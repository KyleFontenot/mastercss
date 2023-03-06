export const textStrokeColor = {
    matches: '^text-stroke-color:.',
    colorStarts: 'text-stroke:',
    colorful: true,
    prop: false,
    get(declaration): { [key: string]: any } {
        return {
            '-webkit-text-stroke-color': declaration
        }
    }
}