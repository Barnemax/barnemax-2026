// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
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
)
