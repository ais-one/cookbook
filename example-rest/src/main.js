'use strict'
import Vue from 'vue'
import VueRx from 'vue-rx'
import Vuetify from 'vuetify'
import VueNativeSock from 'vue-native-websocket'
import i18n from './lang'
import { store } from './store'
import router from './router'
import App from './App'
import VueCrudX from '../../src/VueCrudX' // Component shared between projects

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)

// HTTP connexion to the API
const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:3000/graphql'
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.productionTip = false

Vue.use(VueRx)

// Vue.prototype.$http = base
const WS_URL = process.env.VUE_APP_WS_URL || process.env.VUE_APP_WS_URL === undefined ? 'ws://127.0.0.1:3001' : '' // 'wss://echo.websocket.org'
console.log('WS_URL', WS_URL, process.env.VUE_APP_WS_URL)
if (WS_URL) {
  Vue.use(VueNativeSock, WS_URL, {
    // connectManually: true,
    protocol: '', // default is empty string
    reconnection: true, // (Boolean) whether to reconnect automatically (false)
    // reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
    reconnectionDelay: 5000, // (Number) how long to initially wait before attempting a new (1000)
    // store: store, // VUEX Store
    format: 'json'
  })
} else {
  console.log('NO WS...')
}

Vue.use(Vuetify, {
  theme: {
    primary: '#1c325f',
    secondary: '#219ad6',
    accent: '#0c74bb',
    info: '#2196f3',
    success: '#a4d6e3',
    error: '#f44336',
    warning: '#ffeb3b'
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
})

Vue.component('vue-crud-x', VueCrudX)

/* eslint-disable no-new */
export const app = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  apolloProvider,
  render: h => h(App)
})
