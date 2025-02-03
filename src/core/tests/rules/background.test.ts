import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test.concurrent('background', () => {
    expect(new MasterCSS().create('bg:black')?.text).toContain('background-color:rgb(0 0 0)')
    expect(new MasterCSS().create('bg:light-dark(#000,#fff)')?.text).toContain('background-color:light-dark(#000,#fff)')
    expect(new MasterCSS().create('bg:#fff')?.text).toContain('background-color:#fff')
    expect(new MasterCSS().create('bg:black:hover@md&landscape')?.text).toBe('@media (min-width:1024px) and (orientation:landscape){.bg\\:black\\:hover\\@md\\&landscape:hover{background-color:rgb(0 0 0)}}')
    expect(new MasterCSS().create('bg:transparent')?.text).toContain('background-color:transparent')
    expect(new MasterCSS().create('bg:current')?.text).toContain('background-color:currentColor')
    expect(new MasterCSS().create('background-clip:border')?.text).toContain('-webkit-background-clip:border-box;background-clip:border-box')
    expect(new MasterCSS().create('bg:url(\'#test\')')?.text).toContain('background-image:url(\'#test\')')
    expect(new MasterCSS().create('bg:black|url(\'/images/wallpaper.jpg\')|no-repeat|top|left/cover')?.text).toContain('background:rgb(0 0 0) url(\'/images/wallpaper.jpg\') no-repeat top left/cover')
    expect(new MasterCSS().create('gradient(45deg,#f3ec78,#af4261)')?.text).toContain('background-image:linear-gradient(45deg,#f3ec78,#af4261)')
})

it.concurrent('gradient-related functions should transform "current" to "currentColor"', () => {
    expect(new MasterCSS().create('bg:conic-gradient(current,black)')?.text).toContain('background-image:conic-gradient(currentColor,rgb(0 0 0))')
    expect(new MasterCSS().create('bg:linear-gradient(current,black)')?.text).toContain('background-image:linear-gradient(currentColor,rgb(0 0 0))')
    expect(new MasterCSS().create('bg:radial-gradient(current,black)')?.text).toContain('background-image:radial-gradient(currentColor,rgb(0 0 0))')
    expect(new MasterCSS().create('bg:repeating-linear-gradient(current,black)')?.text).toContain('background-image:repeating-linear-gradient(currentColor,rgb(0 0 0))')
    expect(new MasterCSS().create('bg:repeating-radial-gradient(current,black)')?.text).toContain('background-image:repeating-radial-gradient(currentColor,rgb(0 0 0))')
})