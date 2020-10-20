// const urlParams = new URLSearchParams(window.location.search)
// const myParam = urlParams.get('myParam')
import './bwc-autocomplete.js'

import router from './router.js'
import store from './store.js'
import App from './app.js'

const { createApp } = Vue

const app = createApp(App)
app.config.isCustomElement = tag => tag === 'bwc-autocomplete'
app.use(store)
app.use(router)
app.mount('#app')
