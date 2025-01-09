import { expect, test } from 'vitest'
import { MasterCSS } from '../../src'

test.concurrent('add an animation syntax top-level', () => {
    const css = new MasterCSS()
    css.add('@fade|.3s')
    expect(css.text).toEqual([
        '@layer base,theme,preset,styles,general;',
        '@layer general{.\\@fade\\|\\.3s{animation:fade .3s}}',
        '@keyframes fade{0%{opacity:0}to{opacity:1}}',
    ].join(''))
})
