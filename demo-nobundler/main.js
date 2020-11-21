// const urlParams = new URLSearchParams(window.location.search)
// const myParam = urlParams.get('myParam')
import './components/bwc-autocomplete.js'
import './components/bwc-table.js'

import router from './router.js'
import store from './store.js'
import App from './app.js'

// import * as sleep from '/esm/sleep.js' // served from express /esm static route
// console.log(sleep)

const { createApp } = Vue

const app = createApp(App)
app.config.isCustomElement = tag => tag.startsWith('bwc-')
app.use(store)
app.use(router)
app.mount('#app')
