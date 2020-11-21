module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  env : {
    browser : true,
    node : true,
    es6 : true
  },
  plugins: [
  ],
  extends: 'eslint:recommended',
  rules: {
    'no-prototype-builtins': 'warn',
    'no-empty': 'warn',
    'no-unused-vars': 'off',
  }
}
