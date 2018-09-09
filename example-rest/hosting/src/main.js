'use strict'
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import i18n from './lang'
import router from './router'
import { store } from './store'
import Alert from './components/User/Alert.vue'
// import axios from 'axios'

Vue.config.productionTip = false

// const base = axios.create({
//   baseURL: 'http://127.0.0.1:3000',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   }
// })

// Vue.prototype.$http = base

Vue.use(Vuetify, {
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
})

Vue.component('app-alert', Alert) // Global - components

/* eslint-disable no-new */
export const app = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
