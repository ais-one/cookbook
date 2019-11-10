'use strict'
import Vue from 'vue'
import VueRx from 'vue-rx'
import VueNativeSock from 'vue-native-websocket'
import i18n from './lang'
import { store } from './store'
import router from './router'
import App from './App'

import vuetify from './plugins/vuetify'
import VueCrudX from '../../src/VueCrudX' // Vuetify
import TimePicker from '../../src/TimePicker.vue'
import DatePicker from '../../src/DatePicker.vue'
import FileUpload from '../../src/FileUpload.vue'

import { apolloClient } from './graphql'
import VueApollo from 'vue-apollo'
import { DO_HELLO } from './queries'

import { auth } from '@/firebase'
// import { stitch } from '@/mongo'

import VueCrudA from '../../src/VueCrudA' // Ant design
import { Button, Table, Form, Input } from 'ant-design-vue'

Vue.use(Button) // ant design stuff
Vue.use(Table)
Vue.use(Form)
Vue.use(Input)

Vue.use(VueApollo)

apolloClient.query({
  query: DO_HELLO, // gql`query DoHello($message: String!) { hello(message: $message) }`,
  variables: {
    message: 'Meow'
  }
})
  .then(data => console.log(data))
  .catch(error => console.error(error))

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

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
Vue.component('vue-crud-a', VueCrudA)

/* eslint-disable no-new */
export const app = new Vue({
  el: '#app',
  i18n,
  vuetify,
  router,
  store,
  apolloProvider,
  render: h => h(App),
  created () {
    // firebase
    if (auth) {
      auth.onAuthStateChanged((user) => {
        // console.log('onAuthStateChanged', user)
        if (user) {
          this.$store.dispatch('firebaseAutoSignin', user) // server force keep login
        } else {
          // this.$store.dispatch('baasLogout', {userLogout: false}) // server force logout
        }
      })
    }
    // // mongo - SEEMS LIKE NOT WORKING AT THE MOMENT
    // stitch.auth.addAuthListener(auth => {
    //   console.log('onAuthStateChanged', auth)
    //   if (auth.user) {
    //     this.$store.dispatch('mongoAutoSignin', auth.user) // server force keep login
    //   } else {
    //     // this.$store.dispatch('baasLogout', {userLogout: false}) // server force logout
    //   }
    // })
  }
})
