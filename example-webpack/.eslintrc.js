module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'vue/no-unused-vars': 'off',
    'no-prototype-builtins': 'off',
    'no-empty': 'off',
    'no-unused-vars': 'off',
    'no-console': 'off',
    'standard/no-callback-literal': 'off',
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
