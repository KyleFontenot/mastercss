import { test, it, expect } from 'vitest'
import validateCSS from '../src/validate-css'

it('selector', () => {
    expect(validateCSS('.foo:fuck { font-size: 1rem }')).toEqual([])
})