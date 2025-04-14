module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['prettier', 'extra-rules', 'simple-import-sort', 'import'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        "trailingComma": "es5",
        "singleAttributePerLine": true,
        "jsxBracketSameLine": false,
        "printWidth": 120,
        "arrowParens": "always",
        "bracketSpacing": true
      }
    ],
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'no-shadow': [1],
    'no-undef': 2,
    'no-undefined': 2,
    'no-unused-vars': 0,
    "@typescript-eslint/no-unused-vars": 1,
    semi: 2,
    'react-native/no-unused-styles': 2,
    'react-native/no-color-literals': 1,
    'react-native/no-raw-text': 1,
    'no-dupe-class-members': 2,
    'no-dupe-args': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-duplicate-imports': 1,
    'no-this-before-super': 2,
    'no-var': 1,
    'no-confusing-arrow': 1,
    'no-useless-escape': 0,
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-nested-ternary': 2,
    'prefer-const': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          ['^react', '^@?\\w'],
          [
            '^(@components|@src|@images|@icons|@apis|@screens|@helper|@moment|@i18n|@config|@context|@constants|libs|screen|assets|navigation|components|redux|apis|hooks)(/.*|$)',
          ],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'sort-imports': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
};