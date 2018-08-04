'use strict'
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import i18n from './lang'
import router from './router'
import { auth } from './firebase'
import { store } from './store'
import Alert from './components/User/Alert.vue'

Vue.config.productionTip = false

Vue.use(Vuetify)

Vue.component('app-alert', Alert) // Global - components

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
