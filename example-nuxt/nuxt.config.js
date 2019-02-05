const pkg = require('./package')

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
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
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
          login: { url: 'http://127.0.0.1:3000/api/auth/login', method: 'post', propertyName: 'token' },
          logout: { url: '/api/auth/logout', method: 'post' },
          // user: { url: '/api/auth/user', method: 'get', propertyName: 'user' }
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
