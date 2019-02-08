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

// import axios from 'axios'

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
    // routes: function () {
    //   return axios.get('https://my-api/users')
    //   .then((res) => {
    //     return res.data.map((user) => {
    //       return {
    //         route: '/users/' + user.id,
    //         payload: user
    //       }
    //     })
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
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true
  },
  proxy: {
    '/api/': 'http://localhost:3000'
  },

  auth: {
    plugins: [ '@/plugins/auth.js' ],
    // Options
    redirect: {
      callback: '/callback',
      // login: '/login',
      // logout: '/',
      // callback: '/login',
      // home: '/'
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
      // auth0: {
      //   domain: 'nuxt-auth.auth0.com',
      //   client_id: 'q8lDHfBLJ-Fsziu7bf351OcYQAIe3UJv'
      // },
      // facebook: {
      //   client_id: '1671464192946675',
      //   userinfo_endpoint: 'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email,birthday',
      //   scope: ['public_profile', 'email', 'user_birthday']
      // },
      // google: {
      //   client_id:
      //     '956748748298-kr2t08kdbjq3ke18m3vkl6k843mra1cg.apps.googleusercontent.com'
      // },
      github: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET
      },
      // twitter: {
      //   client_id: 'FAJNuxjMTicff6ciDKLiZ4t0D'
      // }
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
