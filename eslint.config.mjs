import antfu from '@antfu/eslint-config'
import tailwind from 'eslint-plugin-tailwindcss'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(antfu({}, {
  files: ['**/*.vue'],
  rules: {
    'import/exports-last': 'off',
    'import/first': 'off',
    'vue/block-lang': ['error', {
      script: {
        lang: 'ts',
      },
    }],
    'vue/define-props-declaration': ['error', 'type-based'],
    'vue/define-emits-declaration': ['error', 'type-literal'],
  },
}, {
  files: ['**/*.ts', '**/*.vue'],
  rules: {
    'ts/consistent-type-definitions': ['warn', 'type'],
    'ts/no-explicit-any': 'error',
    'node/prefer-global/process': ['error', 'always'],
    'jsdoc/no-multi-asterisks': ['warn', { allowWhitespace: true }],
  },
}, {
  rules: {
    'curly': ['error', 'all'],
    'style/max-statements-per-line': ['error', { max: 1 }],
    'style/brace-style': ['error', '1tbs'],
  },
}), tailwind.configs['flat/recommended'], {
  rules: {
    'tailwindcss/no-custom-classname': 'off',
  },
})
