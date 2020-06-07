import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.esm.browser.min.js'
import Buefy from 'https://cdn.jsdelivr.net/npm/buefy@0.8.9/dist/buefy.esm.min.js'

import Secure from './layouts/secure.js'
import Public from './layouts/public.js'

import router from './router.js'
import store from './store.js'

import { foo } from '/js/datetime.js' // testing
console.log( 'Value from ES Module file...', foo )
// const urlParams = new URLSearchParams(window.location.search)
// const myParam = urlParams.get('myParam')

Vue.use(Buefy)
new Vue({
  el: '#app',
  components: {
    'ms-secure': Secure,
    'ms-public': Public
  },
  store,
  router,
  template: /*html*/`
    <div>
      <ms-public v-if="!$store.getters.user" />
      <ms-secure v-else />
    </div>
  `
})
