module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'off',
    'jsx-quotes': ['error', 'prefer-single'],
    'func-style': ['error', 'expression'],
     'no-unused-vars': 'off'
  },
  ignorePatterns: ['watch_output/', '**/types/'],
  env: {
    node: true,
  },
};
