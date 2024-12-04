import common from '../../eslint.config.mjs'
import vue from 'eslint-plugin-vue'
import vueTS from '@vue/eslint-config-typescript'
import playwright from 'eslint-plugin-playwright'

export default [
    ...common,
    ...vue.configs['flat/essential'],
    ...vueTS(),
    {
        ...playwright.configs['flat/recommended'],
        files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    },
    { files: ['**/*.{ts,mts,tsx,vue}'] },
    { ignores: ['**/.cache/**'] },
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'vue/multi-word-component-names': 'off'
        }
    },
]
