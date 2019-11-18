// import axios from 'axios'
import pkg from './package'
import { GITHUB_CLIENT_SECRET, GITHUB_CLIENT_ID } from './config'

export default {
  server: {
    port: 8080, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
  mode: 'universal',
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  generate: {
    fallback: true // if you want to use '404.html' instead of the default '200.html', uses layouts/error.vue
    // fallback: 'my-fallback/file.html' // if your hosting needs a custom location
  },

  // Customize the progress-bar color
  loading: { color: '#fff' },

  // Global CSS
  css: [],

  // Plugins to load before mounting the App
  plugins: ['@/plugins/axios'],

  // Nuxt.js modules
  modules: [
    '@nuxtjs/axios', // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/auth'
  ],
  // Axios module configuration
  axios: {
    baseURL: 'http://localhost:3000'
    // See https://github.com/nuxt-community/axios-module#options
    // cannot use proxy for nuxt generated
    // proxy: true

    // withCredentials: SAME_ORIGIN ? false : true,
    // withCredentials: true,
    // xsrfCookieName: 'csrftoken_testtest',
    // xsrfHeaderName: 'X-CSRFToken', 
    // headers: {
    //   'Accept': 'application/json',
    //   'Content-Type': 'application/json'
    // }
  },
  // proxy: {
  //   '/api/': 'http://localhost:3000'
  // },

  auth: {
    // watchLoggedIn: false, // CUSTOM WATCH LOGGEDIN - DOES NOT WORK
    // TOREMOVE plugins: ['@/plugins/auth.js'],
    // Options
    redirect: {
      callback: '/callback',
      // login: '/login', // page to redirect to on auth failure, default is /login
      // logout: '/',
      home: false
    },
    strategies: {
      // https://github.com/login/oauth/authorize?scope=user:email&client_id=XXXX
      local: {
        endpoints: {
          login: { url: '/api/auth/login', method: 'post', propertyName: 'token' }, // not used...
          logout: { url: '/api/auth/logout', method: 'get' },
          // user: false // { url: 'http://127.0.0.1:3000/api/auth/user', method: 'get', propertyName: false }
          user: { url: '/api/auth/me', method: 'get', propertyName: 'user' } // or should we get rid of this?
        },
        tokenRequired: true,
        tokenType: 'Bearer'
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
        client_id: GITHUB_CLIENT_ID,
        token_key: 'access_token'
      },
      github: {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET
      }
    }
  },

  // Build configuration
  build: {
    // You can extend webpack config here
    extend(config, ctx) {
      // Run ESLint on save
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }
    }
  }
}
