import { testProp } from './test-css'

test('caret', () => {
    testProp('caret:current', 'caret-color:currentColor')
    testProp('caret:transparent', 'caret-color:transparent')
})
