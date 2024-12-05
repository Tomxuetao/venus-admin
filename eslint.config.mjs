import globals from 'globals'
import pluginJs from '@eslint/js'
import { readFileSync } from 'node:fs'
import pluginVue from 'eslint-plugin-vue'

const autoImportFile = new URL('./auto-import.json', import.meta.url)
const autoImportGlobals = JSON.parse(readFileSync(autoImportFile, 'utf8'))

export default [
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      globals: {
        AMap: true, ...globals.node, ...globals.browser, ...autoImportGlobals.globals
      }
    },
    plugins: {
      pluginVue
    },
    rules: {
      'vue/no-mutating-props': 'off',
      'vue/multi-word-component-names': 'off',
      complexity: ['error', 25],
      'import/extensions': 'off',
      semi: ['error', 'never'],
      'no-useless-escape': 'off',
      quotes: ['error', 'single'],
      'import/no-unresolved': 'off',
      'import/no-absolute-path': 'off',
      'comma-dangle': ['error', 'never'],
      'max-len': ['error', { code: 300 }],
      'import/no-extraneous-dependencies': 'off',
      'no-param-reassign': ['error', { props: false }],
      'no-plusplus': [
        'off', { allowForLoopAfterthoughts: true }
      ],
      'newline-per-chained-call': [
        'error', { ignoreChainWithDepth: 10 }
      ],
      'object-curly-newline': [
        'error', {
          ExportDeclaration: {
            multiline: true,
            minProperties: 3
          },
          ImportDeclaration: {
            multiline: true,
            minProperties: 3
          }
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
