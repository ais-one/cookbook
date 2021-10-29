module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
  },
  env : {
    browser : true,
    node : true,
    es2021 : true,
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
