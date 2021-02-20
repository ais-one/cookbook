// MWC
import '@material/mwc-top-app-bar-fixed'
import '@material/mwc-icon-button'
import '@material/mwc-icon'
import '@material/mwc-drawer'
import '@material/mwc-list'
import '@material/mwc-menu'
import '@material/mwc-textfield'
import '@material/mwc-button'

// pwa
import '../firebase.config.js'
import '../pwa-init.js'

// our own web components
import '../../@es-labs/esm/loading-overlay.js'
import '../../@es-labs/esm/mwc-autocomplete.js'

import { createApp } from 'vue'
import router from './router.js'
import store from './store.js'
import App from './App.vue'

const app = createApp(App)
// console.log('app.config', app.config)
app.config.isCustomElement = (tag) => {
  console.log(tag)
  return tag.startsWith('bwc-') || tag.startsWith('vaadin-') || tag.startsWith('mwc-') || tag.startsWith('vcxwc-') || tag.startsWith('sl-')
}
// app.config.isCustomElement = tag => tag.startsWith('mwc-') // https://zhuanlan.zhihu.com/p/135280049

const theme = 'dark'
// const ThemeSymbol = Symbol()
app.provide('MyTheme', theme) // provide & inject
app.use(store)
app.use(router)
app.mount('#app')
