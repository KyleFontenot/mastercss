import rule from '../../src/rules/class-order'
import { RuleTester } from '@typescript-eslint/rule-tester'

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            ecmaFeatures: {
                jsx: true,
            }
        }
    }
})

ruleTester.run('vue class order', rule, {
    valid: [
        { code: `<div class="bg:black f:24 fg:white m:8 p:8">Simple, basic</div>` }
    ],
    invalid: [
        {
            code: `<template><div class="m:8 bg:black p:8 f:24 fg:white">Enhancing readability</div></template>`,
            output: `<template><div class="bg:black f:24 fg:white m:8 p:8">Enhancing readability</div></template>`,
            errors: [{ messageId: 'invalidClassOrder' }],
            filename: 'test.vue',
            languageOptions: {
                parser: await import('vue-eslint-parser')
            }
        },
        {
            code: `<template><div class="m:8 bg:black p:8 f:24 fg:white">Classnames will be ordered</div></template>`,
            output: `<template><div class="bg:black f:24 fg:white m:8 p:8">Classnames will be ordered</div></template>`,
            errors: [{ messageId: 'invalidClassOrder' }],
            filename: 'test.vue',
            languageOptions: {
                parser: await import('vue-eslint-parser')
            }
        },
        {
            code: `<template><div :class="['m:8 bg:black p:8 f:24 fg:white']">Enhancing readability 2</div></template>`,
            output: `<template><div :class="['bg:black f:24 fg:white m:8 p:8']">Enhancing readability 2</div></template>`,
            errors: [{ messageId: 'invalidClassOrder' }],
            filename: 'test.vue',
            languageOptions: {
                parser: await import('vue-eslint-parser')
            }
        },
        {
            code: `<template><div v-bind:class="{'m:8 bg:black p:8 f:24 fg:white': true}">:)...</div></template>`,
            output: `<template><div v-bind:class="{'bg:black f:24 fg:white m:8 p:8': true}">:)...</div></template>`,
            errors: [{ messageId: 'invalidClassOrder' }],
            filename: 'test.vue',
            languageOptions: {
                parser: await import('vue-eslint-parser')
            }
        },
        {
            code: `<template><div :class="ctl(\`m:8 bg:black p:8 f:24 fg:white \${some}\`)" /></template>`,
            output: `<template><div :class="ctl(\`\${some} bg:black f:24 fg:white m:8 p:8\`)" /></template>`,
            errors: [{ messageId: 'invalidClassOrder' }],
            filename: 'test.vue',
            languageOptions: {
                parser: await import('vue-eslint-parser')
            }
        },
        {
            code: `
                    <template>
                        <div v-bind="data" :class="[
                        'py:1.5 font:semibold transition',
                        {
                            'fg:white': variant === 'white',
                            'fg:blue-50 fg:blue-40:hover b:blue-50': variant === 'primary',
                            'text-decoration:underline|dotted text-underline-offset:10': active
                        }
                        ]" />
                    </template>`,
            output: `
                    <template>
                        <div v-bind="data" :class="[
                        'transition font:semibold py:1.5',
                        {
                            'fg:white': variant === 'white',
                            'b:blue-50 fg:blue-50 fg:blue-40:hover': variant === 'primary',
                            'text-decoration:underline|dotted text-underline-offset:10': active
                        }
                        ]" />
                    </template>`,
            errors: [
                { messageId: 'invalidClassOrder' },
                { messageId: 'invalidClassOrder' }
            ],
            filename: 'test.vue',
            languageOptions: {
                parser: await import('vue-eslint-parser')
            }
        },
        {
            code: `
                    <template>
                        <div :class="[
                            true
                                ? 'fg:#aaaaaa {content:\\'\\';block;h:full;w:full;abs}::after bg:#ffffff'
                                : 'fg:#ffffff'
                        ]"/>
                    </template>`,
            output: `
                    <template>
                        <div :class="[
                            true
                                ? '{content:\\'\\';block;h:full;w:full;abs}::after bg:#ffffff fg:#aaaaaa'
                                : 'fg:#ffffff'
                        ]"/>
                    </template>`,
            errors: [
                { messageId: 'invalidClassOrder' }
            ],
            filename: 'test.vue',
            languageOptions: {
                parser: await import('vue-eslint-parser')
            }
        },
        {
            code: `<template>
                        <input   type="password"
                            placeholder="如果我在Vue元件內不小心寫了沒有function的事件VSCODE的ESLINT套件會無法格式化，輸出會有錯誤"
                            class="bg:black p:8 f:24 fg:white m:8"
                            @blur.prevent="" />
                        </template>`,
            output: `<template>
                        <input   type="password"
                            placeholder="如果我在Vue元件內不小心寫了沒有function的事件VSCODE的ESLINT套件會無法格式化，輸出會有錯誤"
                            class="bg:black f:24 fg:white m:8 p:8"
                            @blur.prevent="" />
                        </template>`,
            errors: [
                { messageId: 'invalidClassOrder' }
            ],
            filename: 'test.vue',
            languageOptions: {
                parser: await import('vue-eslint-parser')
            }
        }
    ],
})