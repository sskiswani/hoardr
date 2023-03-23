/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  plugins: ['prettier'],
  reportUnusedDisableDirectives: true,
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'next/core-web-vitals',
    'prettier',
    'plugin:prettier/recommended'
  ],
  rules: {
    complexity: ['warn', 15],
    eqeqeq: ['warn', 'smart'],
    'no-useless-concat': 'error',
    'prefer-template': 'warn',
    'prettier/prettier': 'warn',
    quotes: ['warn', 'single', { allowTemplateLiterals: true, avoidEscape: true }]
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parserOptions: {
        project: './tsconfig.eslint.json'
      },
      rules: {
        '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/ban-types': ['error', { extendDefaults: true, types: { '{}': false } }],
        '@typescript-eslint/consistent-type-exports': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'warn',
        '@typescript-eslint/no-unnecessary-type-constraint': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
            varsIgnorePattern: '^_'
          }
        ],
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/restrict-template-expressions': ['error', { allowAny: true, allowBoolean: true }],
        '@typescript-eslint/sort-type-union-intersection-members': 'warn'
      }
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-empty-interface': 'off'
      }
    }
  ]
};
