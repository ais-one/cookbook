// const urlParams = new URLSearchParams(window.location.search)
// const myParam = urlParams.get('myParam')

// TBD fix this for production deployments (copy common-lib/esm --> to <example-app>/lib/esm, route <example-app>/lib/esm to /esm)
import '/esm/bwc-autocomplete.js' // served from express /esm static route
import '/esm/bwc-table.js'
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
