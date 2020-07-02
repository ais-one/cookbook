'use strict'
import Vue from 'vue'
import App from './App'

// import './registerServiceWorker' - not used
Vue.config.productionTip = false

/* eslint-disable no-new */
export const app = new Vue({
  el: '#app',
  render: h => h(App)
})
