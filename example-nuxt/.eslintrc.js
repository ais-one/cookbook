module.exports = {
  // root: true,
  // env: {
  //   browser: true,
  //   node: true
  // },
  // parserOptions: {
  //   parser: 'babel-eslint'
  // },
  // extends: [
  //   'plugin:vue/essential',
  //   //'plugin:vue/recommended',
  //   'plugin:prettier/recommended'
  // ],
  // // required to lint *.vue files
  // plugins: ['vue', 'prettier'],
  // // add your custom rules here
  // rules: {
  //   'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  //   'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  //   'vue/max-attributes-per-line': 'off'
  // }
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'eslint:recommended',
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    'plugin:prettier/recommended'
  ],
  // required to lint *.vue files
  plugins: ['vue', 'prettier'], // with this you do not need .prettierrc
  // plugins: ['vue'],
  // add your custom rules here
  rules: {
    semi: [2, 'never'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/max-attributes-per-line': 'off',
    'no-unused-vars': 'off',
    'no-empty': 'off',
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        printWidth : 150
      }
    ]
  }
}
