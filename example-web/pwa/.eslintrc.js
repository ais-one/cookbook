module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {    
    'no-prototype-builtins': 'off',
    'require-atomic-updates': 'off',
    'vue/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'no-empty': 'off',
    'no-console': 'off', // process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}