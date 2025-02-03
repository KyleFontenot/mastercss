import { test, it, expect, describe } from 'vitest'
import { hint } from './test'

test.concurrent('screen size', () => expect(hint('hidden@')?.map(({ label }) => label)).toContain('@sm'))
test.concurrent('&', () => expect(hint('hidden@sm&')?.map(({ label }) => label)).toContain('&sm'))
test.concurrent('&>', () => expect(hint('hidden@sm&>')?.map(({ label }) => label)).toContain('>sm'))
test.concurrent('&>=', () => expect(hint('hidden@sm&>=')?.map(({ label }) => label)).toContain('>=sm'))
test.concurrent('&<', () => expect(hint('hidden@sm&<')?.map(({ label }) => label)).toContain('<sm'))
test.concurrent('&<=', () => expect(hint('hidden@sm&<=')?.map(({ label }) => label)).toContain('<=sm'))

describe.concurrent('sorting', () => {
    test.concurrent('@', () => expect(hint('hidden@')?.map(({ label }) => label)).toEqual([
        '@4xs',
        '@3xs',
        '@2xs',
        '@xs',
        '@sm',
        '@md',
        '@lg',
        '@xl',
        '@2xl',
        '@3xl',
        '@4xl',
        '@all',
        '@landscape',
        '@media()',
        '@motion',
        '@portrait',
        '@print',
        '@reduced-motion',
        '@screen',
        '@speech',
        '@supports()',
    ]))
    test.concurrent('@>', () => expect(hint('hidden@>')?.map(({ label }) => label)).toEqual([
        '>4xs',
        '>3xs',
        '>2xs',
        '>xs',
        '>sm',
        '>md',
        '>lg',
        '>xl',
        '>2xl',
        '>3xl',
        '>4xl'
    ]))
})