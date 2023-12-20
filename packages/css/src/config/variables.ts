import fillColorScale from '../functions/fill-color-scale'

const variables = {
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
    size: {
        full: '100%',
        fit: 'fit-content',
        max: 'max-content',
        min: 'min-content'
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
        view: 'view-box',
        black: '#000000'
    },
    black: '#000000',
    white: '#ffffff',
    current: 'currentColor',
    slate: fillColorScale({
        5: '#141e2b',
        10: '#19212d',
        20: '#262f3e',
        30: '#323e52',
        40: '#41516b',
        50: '#616a84',
        55: '#6c7693',
        60: '#959db3',
        70: '#a3abbf',
        80: '#d7dae3',
        95: '#f6f7f8'
    }),
    gray: fillColorScale({
        5: '#1e1d1f',
        10: '#212022',
        20: '#2f2e30',
        30: '#3e3d40',
        40: '#504f52',
        50: '#6b6a6d',
        55: '#777679',
        60: '#9e9da0',
        70: '#abaaae',
        80: '#dad9db',
        95: '#f5f4f7'
    }),
    brown: fillColorScale({
        5: '#271b15',
        10: '#2b1e18',
        20: '#3c2b22',
        30: '#50382c',
        40: '#694839',
        50: '#8d604b',
        55: '#9d6b53',
        60: '#b79788',
        70: '#c1a598',
        80: '#efd5c9',
        95: '#faf2ef'
    }),
    orange: fillColorScale({
        5: '#2e1907',
        10: '#331b07',
        20: '#47260b',
        30: '#5d320e',
        40: '#7a4111',
        50: '#a15717',
        55: '#b4611a',
        60: '#e38739',
        70: '#e79855',
        80: '#f7d4b5',
        95: '#fcf1e7'
    }),
    gold: fillColorScale({
        5: '#281b00',
        10: '#2d1e01',
        20: '#3f2a00',
        30: '#543800',
        40: '#6d4900',
        50: '#906000',
        55: '#9c6d00',
        60: '#d09100',
        70: '#dca000',
        80: '#fbd67f',
        95: '#fff3d8'
    }),
    yellow: fillColorScale({
        5: '#251d00',
        10: '#282000',
        20: '#3a2e01',
        30: '#4b3b00',
        40: '#624e00',
        50: '#806700',
        55: '#8e7200',
        60: '#be9900',
        70: '#d0a700',
        80: '#edda8f',
        95: '#fff5ca'
    }),
    grass: fillColorScale({
        5: '#162106',
        10: '#182406',
        20: '#223308',
        30: '#2c4408',
        40: '#3a570b',
        50: '#4e750e',
        60: '#74ae15',
        70: '#7dbc17',
        80: '#bfe87c',
        95: '#ebfad4'
    }),
    green: fillColorScale({
        5: '#042311',
        10: '#032611',
        20: '#023717',
        30: '#03481f',
        40: '#025d26',
        50: '#067b34',
        55: '#07883a',
        60: '#09b64d',
        70: '#0ac553',
        80: '#80f1a4',
        95: '#e0fae8'
    }),
    beryl: fillColorScale({
        5: '#002319',
        10: '#00271c',
        20: '#003626',
        30: '#004732',
        40: '#005c41',
        50: '#007954',
        55: '#00875e',
        60: '#00b37c',
        70: '#00c387',
        80: '#72f0c5',
        95: '#d6fcef'
    }),
    teal: fillColorScale({
        5: '#012220',
        10: '#012624',
        20: '#003532',
        30: '#004541',
        40: '#005a54',
        50: '#00776f',
        55: '#00857c',
        60: '#00b1a5',
        70: '#00bfb2',
        80: '#6aeee5',
        95: '#d4fcf8'
    }),
    cyan: fillColorScale({
        5: '#00222b',
        10: '#00252e',
        20: '#013340',
        30: '#004457',
        40: '#00576f',
        50: '#007391',
        55: '#0080a1',
        60: '#00abd7',
        70: '#00b9e9',
        80: '#97e6fa',
        95: '#dff8ff'
    }),
    sky: fillColorScale({
        5: '#031f34',
        10: '#032339',
        20: '#04314e',
        30: '#044169',
        40: '#065386',
        50: '#086eb3',
        55: '#097ac5',
        60: '#29a4f5',
        70: '#4db3f7',
        80: '#b3e0ff',
        95: '#eaf6fe'
    }),
    blue: fillColorScale({
        5: '#07194a',
        10: '#081c53',
        20: '#0a2773',
        30: '#0e3496',
        40: '#1146b6',
        50: '#175fe9',
        55: '#2671ea',
        60: '#6b9ef1',
        70: '#81acf3',
        80: '#c6dbfe',
        95: '#edf4fe'
    }),
    indigo: fillColorScale({
        5: '#1f1645',
        10: '#20174f',
        20: '#2b1f74',
        30: '#37289d',
        40: '#463fb1',
        50: '#5a5bd5',
        55: '#6464f1',
        60: '#9393f5',
        70: '#a1a5ee',
        80: '#d5d7fe',
        95: '#f1f2ff'
    }),
    violet: fillColorScale({
        5: '#2b0a4e',
        10: '#2e0b57',
        20: '#3d1179',
        30: '#4e169f',
        40: '#5f2eba',
        50: '#7949e5',
        55: '#8755f5',
        60: '#ac8af8',
        70: '#b89bf9',
        80: '#e1d4fe',
        95: '#f5f1ff'
    }),
    purple: fillColorScale({
        5: '#2e0c47',
        10: '#330c4e',
        20: '#460f6c',
        30: '#5b1390',
        40: '#7421b1',
        50: '#9832e4',
        55: '#a348e7',
        60: '#c184ef',
        70: '#ca96f1',
        80: '#ead1fe',
        95: '#f9f0ff'
    }),
    fuchsia: fillColorScale({
        5: '#39092a',
        10: '#400932',
        20: '#560d4a',
        30: '#6f1165',
        40: '#8c158a',
        50: '#b61cbb',
        55: '#ca1fce',
        60: '#e66ee9',
        70: '#ea86ed',
        80: '#facbfb',
        95: '#feefff'
    }),
    pink: fillColorScale({
        5: '#3d0722',
        10: '#430725',
        20: '#5d0933',
        30: '#790d44',
        40: '#9a1058',
        50: '#ca1473',
        55: '#e11681',
        60: '#f170b4',
        70: '#f388c0',
        80: '#fdcde6',
        95: '#fff0f8'
    }),
    crimson: fillColorScale({
        5: '#430213',
        10: '#470314',
        20: '#62041c',
        30: '#800524',
        40: '#9f1036',
        50: '#ce1a4b',
        55: '#e8144c',
        60: '#f37596',
        70: '#f58ba7',
        80: '#fdceda',
        95: '#fff1f4'
    }),
    red: fillColorScale({
        5: '#450001',
        10: '#490102',
        20: '#640304',
        30: '#800506',
        40: '#a11012',
        50: '#d11a1e',
        55: '#ed0a0e',
        60: '#f97476',
        70: '#fa8b8d',
        80: '#fdcfcf',
        95: '#fff1f1'
    })
}

export default variables