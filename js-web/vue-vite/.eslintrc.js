module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  // "eslint-plugin-promise": "^5.1.1",
  extends: [
    // 'eslint:recommended',
    // 'standard', // "eslint-config-standard": "^16.0.3",
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'max-statements-per-line': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-empty': 'off',
    'no-prototype-builtins': 'off',
    'no-unused-vars': 'off',
    'no-useless-computed-key': 'off', // cause problem with HTML5 slot
    // 'standard/no-callback-literal': 'off', // useless rule -> need this to work! callback(...args)
    'vue/attributes-order': 'off',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/no-deprecated-slot-attribute': 'off', // interferes with html5 custom elements slot
    'vue/singleline-html-element-content-newline': 'off',
    'vue/no-v-model-argument': 'off',
    // 'vue/max-attributes-per-line': ['error', {
    //   'singleline': 1,
    //   'multiline': {
    //     'max': 1,
    //     'allowFirstLine': false
    //   }
    // }],
    'import/no-absolute-path': 'off',
    'prettier/prettier': 'error'
  },
  plugins: ['vue', 'prettier'],
  overrides: [
    {
      files: ['firebase-messaging-sw.js', 'service-worker.js'],
      globals: {
        importScripts: 'readonly',
        firebase: 'readonly',
        clients: 'readonly'
      }
    },
    {
      files: ['pwa-init.js'],
      globals: {
        firebase: 'readonly',
        CONFIG_FIREBASE_CLIENT: 'readonly',
        CONFIG_VAPID_KEY: 'readonly'
      }
    }
  ]
}
