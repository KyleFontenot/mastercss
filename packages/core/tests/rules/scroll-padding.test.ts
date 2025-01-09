import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

it.concurrent('checks scroll-padding order', () => {
    expect(new MasterCSS().add('scroll-px:0', 'scroll-pl:0', 'scroll-pr:0', 'scroll-p:0', 'scroll-pt:0', 'scroll-pb:0', 'scroll-py:0').generalLayer.rules)
        .toMatchObject([
            { name: 'scroll-p:0' },
            { name: 'scroll-px:0' },
            { name: 'scroll-py:0' },
            { name: 'scroll-pb:0' },
            { name: 'scroll-pl:0' },
            { name: 'scroll-pr:0' },
            { name: 'scroll-pt:0' }
        ])
})

it.concurrent('validates scroll-padding syntaxes', () => {
    expect(new MasterCSS().create('scroll-pl:16')?.text).toContain('scroll-padding-left:1rem')
    expect(new MasterCSS().create('scroll-pr:16')?.text).toContain('scroll-padding-right:1rem')
    expect(new MasterCSS().create('scroll-pt:16')?.text).toContain('scroll-padding-top:1rem')
    expect(new MasterCSS().create('scroll-pb:16')?.text).toContain('scroll-padding-bottom:1rem')
    expect(new MasterCSS().create('scroll-p:16')?.text).toContain('scroll-padding:1rem')
    expect(new MasterCSS().create('scroll-px:16')?.text).toContain('scroll-padding-left:1rem;scroll-padding-right:1rem')
    expect(new MasterCSS().create('scroll-py:16')?.text).toContain('scroll-padding-top:1rem;scroll-padding-bottom:1rem')
    expect(new MasterCSS().create('scroll-padding-x:16')?.text).toContain('scroll-padding-left:1rem;scroll-padding-right:1rem')
    expect(new MasterCSS().create('scroll-padding-y:16')?.text).toContain('scroll-padding-top:1rem;scroll-padding-bottom:1rem')
})