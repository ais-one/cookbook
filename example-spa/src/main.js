'use strict'
import Vue from 'vue'
import VueRx from 'vue-rx'
import VueNativeSock from 'vue-native-websocket'
import i18n from './i18n'
import { store } from './store'
import router from './router'
import App from './App'

import vuetify from './plugins/vuetify'

import VueCrudX from 'ext-lib/webpacked/VueCrudX' // Vuetify
import TimePicker from 'ext-lib/webpacked/TimePicker.vue'
import DatePicker from 'ext-lib/webpacked/DatePicker.vue'
import FileUpload from 'ext-lib/webpacked/FileUpload.vue'

import { apolloClient } from './graphql'
import { DO_HELLO } from './queries'

apolloClient.query({
  query: DO_HELLO, // gql`query DoHello($message: String!) { hello(message: $message) }`,
  variables: {
    message: 'Meow'
  }
}).then(data => console.log(data)).catch(error => console.error(error))

Vue.config.productionTip = false

Vue.use(VueRx)

// Vue.prototype.$http = base
import { WS_URL } from '@/config'
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

Vue.component('app-date-picker', DatePicker)
Vue.component('app-time-picker', TimePicker)
Vue.component('app-file-upload', FileUpload)
Vue.component('vue-crud-x', VueCrudX)

/* eslint-disable no-new */
export const app = new Vue({
  el: '#app',
  i18n,
  vuetify,
  router,
  store,
  render: h => h(App),
  // created () { }
})
