import js from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'

export default [
  js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['scripts/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.astro/'],
  },
]
