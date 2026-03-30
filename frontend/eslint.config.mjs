// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
      'curly': ['error', 'all'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', next: 'return', prev: '*' },
      ],
      'sort-keys': ['error', 'asc', { caseSensitive: false, natural: true }],
      'vue/html-closing-bracket-newline': ['error', {
        multiline: 'always',
        singleline: 'never',
      }],
      'vue/html-indent': ['error', 2],
      'vue/max-attributes-per-line': ['error', {
        multiline: 1,
        singleline: 3,
      }],
      'vue/no-multiple-template-root': 'off',
      'vue/script-indent': ['error', 2, { baseIndent: 0 }],
    },
  },
  {
    files: ['nuxt.config.ts'],
    rules: {
      'nuxt/nuxt-config-keys-order': 'off',
    },
  },
)
