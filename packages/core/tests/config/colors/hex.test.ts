import { it, test, expect, describe } from 'vitest'
import { MasterCSS } from '../../../src'
import { Config } from '../../../src'
import { expectLayers } from '../../test'

/**
 * 1. 000000
 * 2. { space: 'rgb', value: '0 0 0' }
 * 3. --primary: 0 0 0
 */
test.concurrent('#hex to rgb()', () => {
    expect(new MasterCSS({
        variables: { primary: '#000000' }
    }).create('fg:primary')?.text).toBe('.fg\\:primary{color:rgb(0 0 0)}')
})

test.concurrent('color/opacity to rgb(r g b/opacity)', () => {
    expect(new MasterCSS({
        variables: { primary: '#000000' }
    }).create('fg:primary/.5')?.text).toBe('.fg\\:primary\\/\\.5{color:rgb(0 0 0/.5)}')
})

describe.concurrent('with themes', () => {
    const config: Config = {
        variables: {
            primary: {
                '': '#000000',
                '@dark': '#ffffff',
                '@light': '#969696',
                '@chrisma': '$(black)/.5'
            }
        },
        modes: {
            chrisma: 'class'
        }
    }

    it.concurrent('checks resolved colors', () => {
        const css = new MasterCSS(config)
        expect(css.variables.primary).toEqual({
            name: 'primary',
            key: 'primary',
            type: 'color',
            space: 'rgb',
            value: '0 0 0',
            modes: {
                'dark': { name: 'primary', key: 'primary', type: 'color', space: 'rgb', value: '255 255 255' },
                'light': { name: 'primary', key: 'primary', type: 'color', space: 'rgb', value: '150 150 150' },
                'chrisma': { name: 'primary', key: 'primary', type: 'color', space: 'rgb', value: '0 0 0 / .5' }
            }
        })
    })

    it.concurrent('color', () => {
        expectLayers(
            {
                theme: ':root{--primary:0 0 0}.dark{--primary:255 255 255}.light{--primary:150 150 150}.chrisma{--primary:0 0 0 / .5}',
                normal: '.fg\\:primary{color:rgb(var(--primary))}'
            },
            'fg:primary',
            config
        )
    })

    it.concurrent('color/.5', () => {
        expectLayers(
            {
                theme: ':root{--primary:0 0 0}.dark{--primary:255 255 255}.light{--primary:150 150 150}.chrisma{--primary:0 0 0 / .5}',
                normal: '.fg\\:primary\\/\\.5{color:rgb(var(--primary)/.5)}'
            },
            'fg:primary/.5',
            config
        )
    })
})