// needed when used with webpack, vue-cli
module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  'extends': [
    'eslint:recommended'
  ],
  rules: {
    'no-prototype-builtins': 'off',
    'no-empty': 'off',
    'no-unused-vars': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}