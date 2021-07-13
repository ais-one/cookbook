// const urlParams = new URLSearchParams(window.location.search)
// const myParam = urlParams.get('myParam')

import '/esm/bwc-autocomplete.js'
import '/esm/bwc-combobox.js'
import '/esm/bwc-fileupload.js'
import '/esm/bwc-table.js'
import '/esm/bwc-t4t-form.js'

// import * as sleep from '/esm/sleep.js'
// console.log(sleep)

import router from './router.js'
import store from './store.js'
import App from './app.js'

// set baseurl here - need config
// set cors settings - need config
// set/unset token during login/logout, if token in auth header 
const { createApp } = Vue

const app = createApp(App)
app.config.isCustomElement = tag => tag.startsWith('bwc-')
app.use(store)
app.use(router)
app.mount('#app')
