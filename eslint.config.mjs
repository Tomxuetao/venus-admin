import globals from 'globals'
import pluginJs from '@eslint/js'
import { readFileSync } from 'node:fs'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

const autoImportFile = new URL('./auto-import.json', import.meta.url)
const autoImportGlobals = JSON.parse(readFileSync(autoImportFile, 'utf8'))

export default [
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest'
      },
      globals: {
        AMap: true,
        ...globals.node,
        ...globals.browser,
        ...autoImportGlobals.globals
      }
    },
    plugins: {
      prettier,
      pluginVue
    },
    rules: {
      ...prettierConfig.rules,
      'vue/no-mutating-props': 'off',
      'vue/multi-word-component-names': 'off',
      complexity: ['error', 36],
      'import/extensions': 'off',
      semi: ['error', 'never'],
      'no-useless-escape': 'off',
      quotes: ['error', 'single'],
      'import/no-unresolved': 'off',
      'no-useless-assignment': 'off',
      'import/no-absolute-path': 'off',
      'comma-dangle': ['error', 'never'],
      'max-len': ['error', { code: 500 }],
      'import/no-extraneous-dependencies': 'off',
      'no-param-reassign': ['error', { props: false }],
      'no-plusplus': ['off', { allowForLoopAfterthoughts: true }],
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 10 }],
      'object-curly-newline': [
        'error',
        {
          ExportDeclaration: { multiline: true, minProperties: 5 },
          ImportDeclaration: { multiline: true, minProperties: 5 }
        }
      ]
    },
    ignores: [
      'node_modules',
      'dist',
      '*.d.ts',
      '.husky',
      'build',
      'stats.html',
      'venus-admin'
    ]
  }
]
