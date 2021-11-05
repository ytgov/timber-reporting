module.exports = {
  root: true,
  extends: ['react-app', 'eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-boolean-value': ['warn', 'always'],
    'react/jsx-curly-brace-presence': ['warn', { props: 'always', children: 'never' }],
    'jsx-quotes': ['error', 'prefer-single'],
    'func-style': ['error', 'expression'],
    'react/prop-types': 0,
    curly: ['error', 'all'],
  },
  ignorePatterns: ['watch_output/', '**/types/'],
};
