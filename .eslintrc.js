/* eslint-env node */
module.exports = {
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  plugins: ['prettier', 'react', 'react-hooks'],
  rules: {
    'prettier/prettier': ['error'],
    'no-var': ['error'],
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ]
  },
  env: {
    browser: true,
    webextensions: true,
    es2021: true,
    jquery: true,
    serviceworker: true
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
