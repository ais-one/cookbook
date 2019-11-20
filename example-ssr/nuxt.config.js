import pkg from './package'

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
    // fallback: true // if you want to use '404.html' instead of the default '200.html', uses layouts/error.vue
    // fallback: 'my-fallback/file.html' // if your hosting needs a custom location
    fallback: '404.html'
  },

  // Customize the progress-bar color
  loading: { color: '#fff' },

  // Global CSS
  css: [],

  // Plugins to load before mounting the App
  plugins: [
    { src: '@/plugins/axios', mode: 'client' }
  ],

  // Nuxt.js modules
  modules: [
    // removed, not needed
    // '@nuxtjs/axios', // Doc: https://github.com/nuxt-community/axios-module#usage
    // '@nuxtjs/auth'
  ],

  // proxy: {
  //   '/api/': 'http://localhost:3000'
  // },

  // Build configuration
  build: {
    // You can extend webpack config here
    extend(config, ctx) {
      // no need eslint
    }
  }
}
