import colors from '@master/colors'
import extend from '@techor/extend'

// Defualt variables
const _variables = {
    full: '100%',
    fit: 'fit-content',
    max: 'max-content',
    min: 'min-content',
    screen: {
        '4xs': 360,
        '3xs': 480,
        '2xs': 600,
        'xs': 768,
        'sm': 834,
        'md': 1024,
        'lg': 1280,
        'xl': 1440,
        '2xl': 1600,
        '3xl': 1920,
        '4xl': 2560,
    },
    'font-family': {
        mono: [
            'ui-monospace',
            'SFMono-Regular',
            'Menlo',
            'Monaco',
            'Consolas',
            'Liberation Mono',
            'Courier New',
            'monospace'
        ],
        sans: [
            'ui-sans-serif',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            'Noto Sans',
            'sans-serif',
            'Apple Color Emoji',
            'Segoe UI Emoji',
            'Segoe UI Symbol',
            'Noto Color Emoji'
        ],
        serif: [
            'ui-serif',
            'Georgia',
            'Cambria',
            'Times New Roman',
            'Times',
            'serif'
        ]
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
    'flex-direction': {
        col: 'column',
        'col-reverse': 'column-reverse'
    },
    'box-sizing': {
        content: 'content-box',
        border: 'border-box'
    },
    position: {
        abs: 'absolute',
        rel: 'relative'
    },
    'transform-box': {
        content: 'content-box',
        border: 'border-box',
        padding: 'padding-box',
        fill: 'fill-box',
        stroke: 'stroke-box',
        view: 'view-box'
    },
    'animation-direction': {
        alt: 'alternate',
        'alt-reverse': 'alternate-reverse'
    },
    'background-clip': {
        content: 'content-box',
        border: 'border-box',
        padding: 'padding-box'
    },
    'background-origin': {
        content: 'content-box',
        border: 'border-box',
        padding: 'padding-box'
    },
    order: {
        first: -999999,
        last: 999999
    },
    'shape-outside': {
        content: 'content-box',
        border: 'border-box',
        padding: 'padding-box',
        margin: 'margin-box'
    },
    'clip-path': {
        content: 'content-box',
        border: 'border-box',
        padding: 'padding-box',
        margin: 'margin-box',
        fill: 'fill-box',
        stroke: 'stroke-box',
        view: 'view-box'
    },
    current: 'currentColor',
    frame: {
        neutral: {
            '@light': '$(slate-60)',
            '@dark': '$(gray-30)'
        },
        light: {
            '@light': '$(slate-60)/.2',
            '@dark': '$(gray-30)/.2'
        },
        lighter: {
            '@light': '$(slate-60)/.16',
            '@dark': '$(gray-30)/.16'
        },
        lightest: {
            '@light': '$(slate-60)/.12',
            '@dark': '$(gray-30)/.12'
        }
    },
    // from figma
    white: '#ffffff',
    black: '#000000',
    base: {
        '@light': '$(white)',
        '@dark': '$(gray-95)',
    },
    canvas: {
        '@light': '$(slate-5)',
        '@dark': '$(gray-90)',
    },
    surface: {
        '@light': '$(white)',
        '@dark': '$(gray-80)',
    },
    invert: {
        '@light': '$(black)',
        '@dark': '$(white)',
    },
    gray: {
        '@light': '$(gray-30)',
        '@dark': '$(gray-40)',
        active: {
            '@light': '$(gray-40)',
            '@dark': '$(gray-30)',
        },
        text: {
            '@light': '$(gray-90)',
            '@dark': '$(gray-95)',
        },
    },
    text: {
        invert: {
            '@light': '$(white)',
            '@dark': '$(black)',
        },
        strong: {
            '@light': '$(slate-95)',
            '@dark': '$(gray-10)',
        },
        neutral: {
            '@light': '$(slate-70)',
            '@dark': '$(gray-30)',
        },
        lightest: {
            '@light': '$(slate-30)',
            '@dark': '$(gray-60)',
        },
        lighter: {
            '@light': '$(slate-40)',
            '@dark': '$(gray-50)',
        },
        light: {
            '@light': '$(slate-50)',
            '@dark': '$(gray-40)',
        },
        gray: {
            '@light': '$(gray-60)',
            '@dark': '$(gray-30)',
        },
    }
}

const variables = extend(colors, _variables) as (typeof colors & typeof _variables)

export default variables