import { test, it, expect, describe } from 'vitest'
import { hint } from './test'

test.concurrent('one declaration', () => expect(hint('{text:')?.find(({ label }) => label === 'center')).toMatchObject({ label: 'center' }))
test.concurrent('two declarations', () => expect(hint('{block;text:')?.find(({ label }) => label === 'center')).toMatchObject({ label: 'center' }))
it.concurrent('should not hint selectors', () => expect(hint('{block;text:center:')).toBeUndefined())
it.concurrent('should not hint at', () => expect(hint('{block;text:center@')).toBeUndefined())