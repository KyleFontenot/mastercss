import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../../src'
import { expectLayers } from '../../test'

test.concurrent('number', () => {
    expectLayers(
        {
            normal: '.m\\:x1{margin:1rem}'
        },
        'm:x1',
        {
            variables: {
                spacing: { x1: 16 }
            }
        }
    )
})

test.concurrent('number with themes', () => {
    expectLayers(
        {
            normal: '.m\\:x1{margin:calc(var(--spacing-x1) / 16 * 1rem)}',
            theme: ':root{--spacing-x1:16}.dark{--spacing-x1:32}.light{--spacing-x1:48}'
        },
        'm:x1',
        {
            variables: {
                spacing: {
                    x1: {
                        '': 16,
                        '@dark': 32,
                        '@light': 48
                    }
                }
            }
        }
    )

    // 無單位屬性不需要 calc
    expectLayers(
        {
            normal: '.line-height\\:x1{line-height:var(--line-height-x1)}',
            theme: ':root{--line-height-x1:16}.dark{--line-height-x1:32}.light{--line-height-x1:48}'
        },
        'line-height:x1',
        {
            variables: {
                'line-height': {
                    x1: {
                        '': 16,
                        '@dark': 32,
                        '@light': 48
                    }
                }
            }
        }
    )
})

test.concurrent('number using variable function', () => {
    expectLayers(
        {
            normal: '.m\\:\\$\\(spacing-x1\\){margin:1rem}'
        },
        'm:$(spacing-x1)',
        {
            variables: {
                spacing: { x1: 16 }
            }
        }
    )
})

test.concurrent('number with themes using variable function', () => {
    expectLayers(
        {
            normal: '.m\\:\\$\\(spacing-x1\\){margin:calc(var(--spacing-x1) / 16 * 1rem)}',
            theme: ':root{--spacing-x1:16}.dark{--spacing-x1:32}.light{--spacing-x1:48}'
        },
        'm:$(spacing-x1)',
        {
            variables: {
                spacing: {
                    x1: {
                        '': 16,
                        '@dark': 32,
                        '@light': 48
                    }
                }
            }
        }
    )

    // 無單位屬性不需要 calc
    expectLayers(
        {
            normal: '.line-height\\:\\$\\(spacing-x1\\){line-height:var(--spacing-x1)}',
            theme: ':root{--spacing-x1:16}.dark{--spacing-x1:32}.light{--spacing-x1:48}'
        },
        'line-height:$(spacing-x1)',
        {
            variables: {
                spacing: {
                    x1: {
                        '': 16,
                        '@dark': 32,
                        '@light': 48
                    }
                }
            }
        }
    )
})

test.concurrent('variables', () => {
    expect(new MasterCSS({
        variables: {
            spacing: { x1: 16, x2: 32 },
        }
    }).create('m:$(spacing-x1)')?.text).toBe('.m\\:\\$\\(spacing-x1\\){margin:1rem}')
})

test.concurrent('negative variables', () => {
    expect(new MasterCSS({
        variables: {
            spacing: { x1: 16, x2: 32 }
        }
    }).create('m:$(-spacing-x1)')?.text).toBe('.m\\:\\$\\(-spacing-x1\\){margin:-1rem}')

    expectLayers(
        {
            normal: '.w\\:-11x{width:-3.75rem}'
        },
        'w:-11x',
        {
            variables: {
                width: { '11x': 60 }
            }
        }
    )
})