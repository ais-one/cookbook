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
import { VITE_GQL_URI, VITE_GWS_URI } from '/config.js'
// import createApollo from './graphql'
import createApollo from '/src/lib/esm/graphql'
import { DO_HELLO } from './queries'

let apolloClient = createApollo({
  gws_uri: VITE_GWS_URI,
  gql_uri: VITE_GQL_URI
})
if (apolloClient) { // test
  apolloClient.query({
    query: DO_HELLO, // gql`query DoHello($message: String!) { hello(message: $message) }`,
    variables: {
      message: 'Meow'
    }
  }).then(data => console.log('graphql', data)).catch(error => console.error(error))
}

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
