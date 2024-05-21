import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test.concurrent('color', () => {
    expect(new MasterCSS().add('color:current:hover').text).toBe('.color\\:current\\:hover:hover{color:currentColor}')
    expect(new MasterCSS().create('color:current')?.declarations).toStrictEqual({ color: 'currentColor' })
    expect(new MasterCSS().create('color:current')?.text).toContain('color:currentColor')
    expect(new MasterCSS().create('color:rgb(255,255,255)')?.text).toContain('color:rgb(255,255,255)')
    expect(new MasterCSS().create('fg:#fff')?.text).toContain('color:#fff')
    expect(new MasterCSS().create('fg:current')?.text).toContain('color:currentColor')
    expect(new MasterCSS().create('fg:transparent')?.text).toContain('color:transparent')
    expect(new MasterCSS().create('fg:inherit')?.text).toContain('color:inherit')
})
