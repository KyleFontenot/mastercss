import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

it.concurrent('validates width syntaxes', () => {
    expect(new MasterCSS().create('w:screen-sm')?.text).toContain('width:52.125rem')
    expect(new MasterCSS().create('w:1/4')?.text).toContain('width:25%')
})

test.concurrent('sizing', () => {
    expect(new MasterCSS().create('w:full')?.text).toContain('width:100%')
    expect(new MasterCSS().create('w:fit')?.text).toContain('width:fit-content')
    expect(new MasterCSS().create('w:max')?.text).toContain('width:max-content')
    expect(new MasterCSS().create('w:min')?.text).toContain('width:min-content')
    expect(new MasterCSS().create('w:screen-4xs')?.text).toContain('width:22.5rem')
    expect(new MasterCSS().create('w:screen-3xs')?.text).toContain('width:30rem')
    expect(new MasterCSS().create('w:screen-2xs')?.text).toContain('width:37.5rem')
    expect(new MasterCSS().create('w:screen-xs')?.text).toContain('width:48rem')
    expect(new MasterCSS().create('w:screen-sm')?.text).toContain('width:52.125rem')
    expect(new MasterCSS().create('w:screen-md')?.text).toContain('width:64rem')
    expect(new MasterCSS().create('w:screen-lg')?.text).toContain('width:80rem')
    expect(new MasterCSS().create('w:screen-xl')?.text).toContain('width:90rem')
    expect(new MasterCSS().create('w:screen-2xl')?.text).toContain('width:100rem')
    expect(new MasterCSS().create('w:screen-3xl')?.text).toContain('width:120rem')
    expect(new MasterCSS().create('w:screen-4xl')?.text).toContain('width:160rem')
})