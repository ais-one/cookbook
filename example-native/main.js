// const urlParams = new URLSearchParams(window.location.search)
// const myParam = urlParams.get('myParam')

// TBD fix this for production deployments (copy lib/esm --> to <example-app>/lib/esm, route <example-app>/lib/esm to /esm)
import '/esm/http.js' // served from express /esm static route
import '/esm/bwc-autocomplete.js'
import '/esm/bwc-autocomplete2.js'
import '/esm/bwc-fileupload.js'
import '/esm/bwc-table.js'
import '/esm/bwc-t4t-form.js'
import '/esm/bwc-multiselect.js'
// import * as sleep from '/esm/sleep.js'
// console.log(sleep)

import router from './router.js'
import store from './store.js'
import App from './app.js'

const { createApp } = Vue

const app = createApp(App)
app.config.isCustomElement = tag => tag.startsWith('bwc-')
app.use(store)
app.use(router)
app.mount('#app')
