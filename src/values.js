const boxUnderneath = {
    content: 'content-box',
    border: 'border-box',
    padding: 'padding-box'
}

const contentExtrema = {
    min: 'min-content',
    max: 'max-content'
}

module.exports = {
    'background-clip': boxUnderneath,
    'background-origin': boxUnderneath,
    'box-sizing': {
        content: 'content-box',
        border: 'border-box',
    },
    'clip-path': {
        ...boxUnderneath,
        margin: 'margin-box',
        fill: 'fill-box',
        stroke: 'stroke-box',
        view: 'view-box'
    },
    'flex-direction': {
        col: COLUMN,
        'col-reverse': 'column-reverse'
    },
    'font-family': {
        mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
        sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
        serif: 'ui-serif, Georgia, Cambria, Times New Roman, Times, serif'
    },
    'font-weight': {
        thin: 100,
        extralight: 200,
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        heavy: 900
    },
    'grid-auto-columns': contentExtrema,
    'grid-auto-rows': contentExtrema,
    'grid-template-columns': contentExtrema,
    'grid-template-rows': contentExtrema,
    order: {
        first: -999999,
        last: 999999
    },
    position: {
        abs: 'absolute',
        rel: 'relative'
    },
    'shape-outside': {
        ...boxUnderneath,
        margin: 'margin-box'
    },
    'transform-box': {
        ...boxUnderneath,
        fill: 'fill-box',
        stroke: 'stroke-box',
        view: 'view-box'
    }
}