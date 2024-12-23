import { it, test, expect, describe } from 'vitest'
import { MasterCSS } from '../../src'
import { expectLayers } from '../test'

describe.concurrent('@tve', () => {
    it.concurrent('scope', () => {
        expectLayers(
            {
                normal: '.master-css .pt\\:2ex{padding-top:2ex}'
            },
            'pt:2ex',
            { scope: '.master-css' }
        )
        expectLayers(
            {
                normal: '.dark .master-css .pt\\:2ex\\@dark{padding-top:2ex}'
            },
            'pt:2ex@dark',
            { scope: '.master-css' }
        )
    })
})
