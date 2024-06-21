import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../../src'

it.concurrent('should be able to access custom spacing variables using inherited syntaxes', () => {
    const css = new MasterCSS({
        variables: {
            spacing: {
                md: 20
            }
        }
    })
    expect(css.create('mt:md')?.declarations).toStrictEqual({ 'margin-top': '1.25rem' })
    expect(css.create('p:md')?.declarations).toStrictEqual({ 'padding': '1.25rem' })
    expect(css.create('p:-md')?.declarations).toStrictEqual({ 'padding': '-1.25rem' })
    expect(css.syntaxes.find(({ id }) => id === 'padding')).toMatchObject({
        definition: {
            variables: ['spacing']
        },
        variables: {
            'md': {
                'group': 'spacing',
                'key': 'md',
                'type': 'number',
                'value': 20,
            },
            '-md': {
                'group': 'spacing',
                'key': '-md',
                'type': 'number',
                'value': -20,
            }
        }
    })
})