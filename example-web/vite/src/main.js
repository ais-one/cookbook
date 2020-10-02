// MWC
import '@material/mwc-top-app-bar-fixed'
import '@material/mwc-icon-button'
import '@material/mwc-icon'
// import '@material/mwc-icon/mwc-icon-font'
import '@material/mwc-drawer'
import '@material/mwc-list'
import '@material/mwc-list/mwc-list-item'
import '@material/mwc-list/mwc-check-list-item'
import '@material/mwc-menu'
import '@material/mwc-textfield'
import '@material/mwc-select'
import '@material/mwc-button'
import '@material/mwc-dialog'

// Vaadin
import '@vaadin/vaadin-grid'
import '@vaadin/vaadin-grid/vaadin-grid-selection-column'
import '@vaadin/vaadin-grid/vaadin-grid-sort-column'

// our own web components
import './lib/esm/loading-overlay.js' // global import
import './components/mwc-autocomplete.js'
import './components/mwc-multiselect.js'
import './components/mwc-fileupload.js'

import { createApp } from 'vue'
import App from './App.vue'

import router from './router.js'
import store from './store.js'


// GraphQL
// import { VITE_GRAPHQL } from '/config.js'
// import { apolloClient } from './graphql'
// import { DO_HELLO } from './queries'
// if (VITE_GRAPHQL) { // test
//   apolloClient.query({
//     query: DO_HELLO, // gql`query DoHello($message: String!) { hello(message: $message) }`,
//     variables: {
//       message: 'Meow'
//     }
//   }).then(data => console.log(data)).catch(error => console.error(error))
// }

const app = createApp(App)

const theme = 'dark'
// const ThemeSymbol = Symbol()
app.provide('MyTheme', theme) // provide & inject

// Vue.config.ignoredElements = [/test-\w*/]
// app.config.isCustomElement = tag => {
//   console.log('tag', tag)
//   return tag === 'mwc-button' // https://zhuanlan.zhihu.com/p/135280049
// }
// app.config.isCustomElement = () => true
// console.log('app.config', app.config)

app.use(store)
app.use(router)

app.mount('#app')
