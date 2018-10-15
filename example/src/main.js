'use strict'
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import i18n from './lang'
import router from './router'
import { auth } from './firebase'
import { store } from './store'
import Alert from './components/User/Alert.vue'
import DatePicker from './components/DatePicker.vue'

Vue.config.productionTip = false

// Global components
Vue.component('app-alert', Alert)
Vue.component('app-date-picker', DatePicker)

Vue.use(Vuetify, {
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
})

/* eslint-disable no-new */
export const app = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App),
  created () {
    auth.onAuthStateChanged((user) => {
      // console.log('onAuthStateChanged', user)
      if (user) {
        this.$store.dispatch('autoSignIn', user) // server force keep login
      } else {
        // this.$store.dispatch('logout', {userLogout: false}) // server force logout
      }
    })
  }
})
