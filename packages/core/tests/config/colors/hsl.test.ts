import { it, test, expect, describe } from 'vitest'
import MasterCSS, { Config } from '../../../src'

// color functions 使用該格式 "hsl(0deg 0% 0%/.5)".match(/([a-zA-Z]+)\((.*?)\)/) 提取 space 及 value
// -> ['hsl(0deg 0% 0%/.5)', 'hsl', '0deg 0% 0%/.5', index: 0, input: 'hsl(0deg 0% 0%/.5)', groups: undefined]

/**
 * 1. hsl(0deg 0% 0%)
 * 2. { space: 'hsl', value: '0deg 0% 0%/.5' }
 * 3. --primary: 0deg 0% 0%/.5
 */
test.concurrent('hsl()', () => {
    expect(new MasterCSS({
        variables: { primary: 'hsl(0deg 0% 0%/.5)' }
    }).create('fg:primary')?.text
    ).toBe('.fg\\:primary{color:hsl(0deg 0% 0%/.5)}')
})

test.concurrent('color/opacity to hsl(h s l/opacity / opacity) invalid rule', () => {
    expect(new MasterCSS({
        variables: { primary: 'hsl(0deg 0% 0%/.5)' }
    }).create('fg:primary/.5')?.text
    ).toBe('.fg\\:primary\\/\\.5{color:hsl(0deg 0% 0%/.5/.5)}')
})

describe.concurrent('with themes', () => {
    const config: Config = {
        variables: {
            primary: {
                '': 'hsl(0deg 0% 0%)',
                '@dark': 'hsl(0deg 0% 100%)',
                '@light': 'hsl(0deg 0% 58.82%)',
                '@chrisma': 'hsl(0deg 0% 0%/.5)'
            }
        },
        modes: { chrisma: 'class' }
    }

    it.concurrent('checks resolved colors', () => {
        const css = new MasterCSS(config)
        expect(css.variables.primary).toEqual({
            name: 'primary',
            key: 'primary',
            type: 'color',
            space: 'hsl',
            value: '0deg 0% 0%',
            modes: {
                'dark': { name: 'primary', key: 'primary', type: 'color', space: 'hsl', value: '0deg 0% 100%' },
                'light': { name: 'primary', key: 'primary', type: 'color', space: 'hsl', value: '0deg 0% 58.82%' },
                'chrisma': { name: 'primary', key: 'primary', type: 'color', space: 'hsl', value: '0deg 0% 0%/.5' }
            }
        })
    })

    it.concurrent('color', () => {
        expect(new MasterCSS(config).add('fg:primary')?.text).toBe([
            ':root{--primary:0deg 0% 0%}',
            '.dark{--primary:0deg 0% 100%}',
            '.light{--primary:0deg 0% 58.82%}',
            '.chrisma{--primary:0deg 0% 0%/.5}',
            '.fg\\:primary{color:hsl(var(--primary))}'
        ].join(''))
    })

    it.concurrent('color/.5', () => {
        expect(new MasterCSS(config).add('fg:primary/.5')?.text).toBe([
            ':root{--primary:0deg 0% 0%}',
            '.dark{--primary:0deg 0% 100%}',
            '.light{--primary:0deg 0% 58.82%}',
            '.chrisma{--primary:0deg 0% 0%/.5}',
            '.fg\\:primary\\/\\.5{color:hsl(var(--primary)/.5)}'
        ].join(''))
    })
})