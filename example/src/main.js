'use strict'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueFire from 'vuefire'
import App from './App'
import router from './router'
import { auth } from './firebase'
import { store } from './store'
import Alert from './components/User/Alert.vue'

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(VueFire)
Vue.component('app-alert', Alert) // Global - components

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    auth.onAuthStateChanged((user) => {
      console.log('onAuthStateChanged', user)
      if (user) {
      } else {
        this.$store.dispatch('logout', {userLogout: false}) // server force logout
      }
    })
  }
})
