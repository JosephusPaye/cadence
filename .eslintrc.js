const prettierConfig = require('./prettier.config');

module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    chrome: true,
  },
  extends: ['plugin:vue/essential', '@vue/prettier'],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': ['warn', prettierConfig],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
