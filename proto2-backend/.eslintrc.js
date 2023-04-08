module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    indent: ['warn', 2],
    'linebreak-style': ['warn', 'unix'],
    quotes: [
      'warn',
      'single',
      {
        allowTemplateLiterals: true,
      },
    ],
    semi: ['warn', 'always'],
    'no-process-env': 'error',
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'warn',
    'no-unused-expressions': 'warn',
    'no-useless-constructor': 'warn',
    'no-useless-return': 'warn',
  },
};
