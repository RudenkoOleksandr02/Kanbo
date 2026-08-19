import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import fsdPaths from '@sashar/eslint-plugin-fsd-paths'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      '@sashar/fsd-paths': fsdPaths,
    },
    rules: {
      '@sashar/fsd-paths/path-checker': ['error', { alias: '@' }],
      '@sashar/fsd-paths/public-api-imports': ['error', {
        alias: '@',
        testFilesPatterns: ['**/*.test.*', '**/*.spec.*'],
      }],
      '@sashar/fsd-paths/layer-imports': ['error', {
        alias: '@',
        ignoreImportPatterns: ['**/styles/**', '**/StoreProvider'],
      }],
    },
  },
])
