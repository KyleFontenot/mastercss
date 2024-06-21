import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../../src'
import config from '../../config'
import { expectLayers } from '../../test'

test.concurrent('colors', () => {
    expectLayers(
        {
            theme: ':root{--primary:0 0 0}.light{--primary:0 0 0}.dark{--primary:255 255 255}',
            utility: '.fg\\:primary{color:rgb(var(--primary))}'
        },
        'fg:primary',
        config
    )

    expectLayers(
        {
            theme: ':root{--primary-code:0 0 0}.dark{--primary-code:255 255 255}',
            utility: '.fg\\:primary-code{color:rgb(var(--primary-code))}'
        },
        'fg:primary-code',
        config
    )

    expectLayers(
        {
            theme: ':root{--primary-stage-1:255 255 255}.light{--primary-stage-1:0 0 0}.dark{--primary-stage-1:255 255 255}',
            utility: '.fg\\:primary-stage-1{color:rgb(var(--primary-stage-1))}'
        },
        'fg:primary-stage-1',
        config
    )

    expectLayers(
        {
            utility: '.b\\:input{border-color:rgb(18 52 86)}'
        },
        'b:input',
        config
    )

    expectLayers(
        {
            utility: '.bg\\:blue-100{background-color:rgb(119 119 119)}'
        },
        'bg:blue-100',
        {
            variables: {
                'blue-100': '#777'
            }
        }
    )

    expectLayers(
        {
            utility: '.bg\\:primary-alpha{background-color:rgb(255 255 255 / .1)}'
        },
        'bg:primary-alpha',
        config
    )

    expectLayers(
        {
            utility: '.bg\\:primary-rgb1{background-color:rgb(0 0 0)}'
        },
        'bg:primary-rgb1',
        config
    )

    expectLayers(
        {
            utility: '.bg\\:primary-rgb2{background-color:rgb(0 0 0)}'
        },
        'bg:primary-rgb2',
        config
    )

    expectLayers(
        {
            utility: '.bg\\:primary-rgb3{background-color:rgb(0 0 0 / .5)}'
        },
        'bg:primary-rgb3',
        config
    )

    expectLayers(
        {
            utility: '.bg\\:primary-rgb4{background-color:rgb(0 0 0 / .5)}'
        },
        'bg:primary-rgb4',
        config
    )

    expectLayers(
        {
            utility: '.bg\\:primary-2{background-color:rgb(0 0 0 / .35)}'
        },
        'bg:primary-2',
        config
    )

    expectLayers(
        {
            theme: '.light,:root{--major:0 0 0}.dark{--major:255 255 255}',
            utility: '.bg\\:linear-gradient\\(180deg\\,major\\,black\\){background-image:linear-gradient(180deg,rgb(var(--major)),rgb(0 0 0))}'
        },
        'bg:linear-gradient(180deg,major,black)',
        config
    )

    expectLayers(
        {
            theme: '.light,:root{--accent:17 17 17}.dark{--accent:238 238 238}.light,:root{--primary:0 0 0}.dark{--primary:255 255 255}',
            utility: '.bg\\:linear-gradient\\(180deg\\,primary\\,accent\\){background-image:linear-gradient(180deg,rgb(var(--primary)),rgb(var(--accent)))}'
        },
        'bg:linear-gradient(180deg,primary,accent)',
        {
            variables: {
                primary: {
                    '@light': '#000000',
                    '@dark': '#ffffff'
                },
                accent: {
                    '@light': '#111111',
                    '@dark': '#eeeeee'
                }
            }
        }
    )

    expectLayers(
        {
            theme: '.dark{--accent:238 238 238}.light,:root{--primary:0 0 0}.dark{--primary:255 255 255}',
            utility: '.bg\\:linear-gradient\\(180deg\\,primary\\,accent\\){background-image:linear-gradient(180deg,rgb(var(--primary)),rgb(var(--accent)))}'
        },
        'bg:linear-gradient(180deg,primary,accent)',
        {
            variables: {
                primary: {
                    '@light': '#000000',
                    '@dark': '#ffffff'
                },
                accent: {
                    '@dark': '#eeeeee'
                }
            }
        }
    )

    expectLayers(
        {
            theme: '.light,:root{--primary:0 0 0}.dark{--primary:255 255 255}',
            utility: '.bg\\:linear-gradient\\(180deg\\,primary\\,accent\\){background-image:linear-gradient(180deg,rgb(var(--primary)),accent)}'
        },
        'bg:linear-gradient(180deg,primary,accent)',
        {
            variables: {
                primary: {
                    '@light': '#000000',
                    '@dark': '#ffffff'
                }
            }
        }
    )

    expectLayers(
        {
            theme: ':root{--accent:255 0 0}.dark{--accent:170 0 0}.light,:root{--primary:0 0 0}.dark{--primary:255 255 255}',
            utility: '.bg\\:linear-gradient\\(180deg\\,primary\\,accent\\){background-image:linear-gradient(180deg,rgb(var(--primary)),rgb(var(--accent)))}'
        },
        'bg:linear-gradient(180deg,primary,accent)',
        {
            variables: {
                accent: {
                    '': '#ff0000',
                    '@dark': '#aa0000'
                },
                primary: {
                    '@light': '#000000',
                    '@dark': '#ffffff'
                }
            }
        }
    )

    expectLayers(
        {
            theme: '.light,:root{--fade:204 204 204}.dark{--fade:51 51 51}',
            utility: '.\\{block\\;fg\\:fade\\}_\\:where\\(p\\)_code\\:before :where(p) code:before{display:block;color:rgb(var(--fade))}'
        },
        '{block;fg:fade}_:where(p)_code:before',
        {
            variables: {
                fade: {
                    '@light': '#cccccc',
                    '@dark': '#333333'
                }
            }
        }
    )

    expectLayers(
        {
            theme: ':root{--primary-filled:0 0 0}.light{--primary-filled:255 255 255}.dark{--primary-filled:0 0 0}',
            style: '.btn{background-color:rgb(var(--primary-filled))}'
        },
        'btn',
        {
            variables: {
                primary: {
                    filled: {
                        '': '$(black)',
                        '@light': '$(white)',
                        '@dark': '$(black)'
                    }
                }
            },
            styles: {
                btn: 'bg:primary-filled'
            }
        }
    )

    expectLayers(
        {
            theme: ':root{--primary-filled:0 0 0}.light{--primary-filled:255 255 255}.dark{--primary-filled:0 0 0}',
            utility: '.bg\\:primary-filled{background-color:rgb(var(--primary-filled))}'
        },
        'bg:primary-filled',
        {
            variables: {
                primary: {
                    filled: {
                        '': '$(black)',
                        '@light': '$(white)',
                        '@dark': '$(black)'
                    }
                }
            },
            styles: {
                btn: 'bg:primary-filled'
            }
        }
    )

    expectLayers(
        {
            utility: '.dark .bg\\:primary-filled\\@dark{background-color:rgb(255 255 255)}'
        },
        'bg:primary-filled@dark',
        {
            variables: {
                primary: {
                    filled: {
                        '': '$(white)',
                        '@light': '$(black)',
                        '@dark': '$(white)'
                    }
                }
            },
            styles: {
                btn: 'bg:primary-filled'
            }
        }
    )

    expectLayers(
        {
            theme: '.light,:root{--code:0 0 0}.dark{--code:255 255 255}',
            utility: '.bg\\:code{background-color:rgb(var(--code))}'
        },
        'bg:code',
        config
    )

    expectLayers(
        {
            theme: '.light,:root{--code:0 0 0}.dark{--code:255 255 255}',
            utility: '.bg\\:code\\/\\.5{background-color:rgb(var(--code)/.5)}'
        },
        'bg:code/.5',
        config
    )

    expectLayers(
        {
            theme: '.light,:root{--fade-light:0 0 0}',
            utility: '.bg\\:fade-light{background-color:rgb(var(--fade-light))}'
        },
        'bg:fade-light',
        config
    )
})

it.concurrent('checks if similar color names collide.', () => {
    expectLayers(
        {
            utility: '.fg\\:a-1{color:rgb(0 0 0)}'
        },
        'fg:a-1',
        {
            variables: {
                a: {
                    1: '#000000'
                },
                aa: {
                    1: '#ff0000'
                }
            }
        }
    )
})