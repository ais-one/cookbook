const pkg = require('./package')
const dotenv = require('dotenv')
dotenv.config()
const fs = require('fs')
if (process.env.NODE_ENV) {
  try {
    const envConfig = dotenv.parse(fs.readFileSync('.env.' + process.env.NODE_ENV))
    for (var k in envConfig) process.env[k] = envConfig[k]  
  } catch (e) {
    console.log('missing configuration file, using defaults')
  }
}

import axios from 'axios'

module.exports = {
  server: {
    port: 8080, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },

  generate: {
    // https://github.com/nuxt/nuxt.js/issues/1018
    // routes: function () {
    //   let posts = axios.get('https://api.com/posts', {params: {size: 10}}).then((res) => { // get about 10 records from API to populate page
    //     return res.data.posts.map((post) => {
    //       return '/feed/' + post.id
    //     })
    //   })
    //   let users = axios.get('https://api.com/users', {params: {size: 10}}).then((res) => { // get about 10 records from API to populate page
    //     return res.data.content.map((user) => {
    //       return '/user/' + user.id
    //     })
    //   })
    //   return Promise.all([posts, users]).then(values => {
    //     return values.join().split(',');
    //   })
    // }
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vue-rx',
    '@/plugins/vuetify',
    '@/plugins/axios'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    ['@nuxtjs/dotenv', {
      filename: '.env.' + process.env.NODE_ENV
    }],
    '@nuxtjs/axios', // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/auth',
    ['nuxt-i18n', {
      locales: [
        { 
          code: 'en',
          iso: 'en-US'
        },
        { 
          code: 'fr',
          iso: 'fr-FR'
        }
      ],
      defaultLocale: 'en',
      vueI18n: {
        silentTranslationWarn: true,
        fallbackLocale: 'en',
        messages: {
          en: {
            welcome: 'Welcome'
          },
          fr: {
            welcome: 'Bienvenue'
          }
        }
      }
    }]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: 'http://localhost:3000'
    // See https://github.com/nuxt-community/axios-module#options
    // cannot use proxy for nuxt generated
    // proxy: true
  },
  // proxy: {
  //   '/api/': 'http://localhost:3000'
  // },

  auth: {
    // watchLoggedIn: false, // CUSTOM WATCH LOGGEDIN - DOES NOT WORK
    plugins: [ '@/plugins/auth.js' ],
    // Options
    redirect: {
      callback: '/callback',
      // login: '/login',
      // logout: '/',
      home: false
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/auth/login', method: 'post', propertyName: 'token' }, // not used...
          logout: { url: '/api/auth/logout', method: 'get' },
          // user: false // { url: 'http://127.0.0.1:3000/api/auth/user', method: 'get', propertyName: false }
          user: { url: '/api/auth/me', method: 'get', propertyName: 'user' } // or should we get rid of this?
        },
        tokenRequired: true,
        tokenType: 'Bearer',
      },
      social: {
        _scheme: 'oauth2',
        authorization_endpoint: 'https://github.com/login/oauth/authorize',
        access_token_endpoint: 'https://github.com/login/oauth/access_token',
        userinfo_endpoint: false, // we get info in callback
        scope: ['user', 'email'],
        response_type: 'token',
        token_type: 'Bearer',
        redirect_uri: undefined,
        client_id: process.env.GITHUB_CLIENT_ID,
        token_key: 'access_token'    
      },
      github: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET
      }
    }
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
