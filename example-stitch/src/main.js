'use strict'
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from '@/App'
import i18n from '@/lang'
import router from '@/router'
import { stitch } from '@/mongo'
import { store } from '@/store'
import TimePicker from '@/components/TimePicker.vue'
import DatePicker from '@/components/DatePicker.vue'
import VueCrudX from '../../src/VueCrudX' // Component shared between projects

Vue.config.productionTip = false

Vue.use(Vuetify, {
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
})

// Global components
Vue.component('app-date-picker', DatePicker)
Vue.component('app-time-picker', TimePicker)
Vue.component('vue-crud-x', VueCrudX)

/* eslint-disable no-new */
export const app = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App),
  created () {
    stitch.auth.addAuthListener(auth => {
      // console.log('onAuthStateChanged', auth.user)
      if (auth.user) {
        this.$store.dispatch('autoSignIn', auth.user) // server force keep login
      } else {
        // this.$store.dispatch('logout', {userLogout: false}) // server force logout
      }
    })
  }
})
