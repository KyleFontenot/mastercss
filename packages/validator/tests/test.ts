import { test, it, expect } from 'vitest'
import { generateValidRules, validate } from '../src'
import expectClassWithErrors from './utils/expect-class-with-errors'
import expectClassWithoutErrors from './utils/expect-class-without-errors'
import expectClassInvalid from './utils/expect-class-invalid'
import expectClassValid from './utils/expect-class-valid'

it('validate an invalid CSS property value', () => {
    expectClassWithErrors('text-align:asdf')
    expectClassInvalid('text-align:asdf')
})

it('validate valid classes', () => {
    expectClassWithoutErrors('text:center')
    expectClassWithoutErrors('font:12@sm')
    expectClassWithoutErrors('mt:$(top)')
    expect(validate('bg:light-dark(#333b3c,#efefec)').errors).toEqual([])
    expectClassValid('text:center')
    expectClassValid('font:12@sm')
    expectClassValid('mt:$(top)')
})

it('create rules by class', () => {
    expect(generateValidRules('text:center')).toHaveLength(1)
    expect(generateValidRules('text:cente')).toHaveLength(0)
})

it('fairly irregular classes can be ignored very well', () => {
    expect(generateValidRules('shadow:rgba(45,43,37,0.05)|0|-1|0|0|inset,rgba(15,14,12,')).toHaveLength(0)
})