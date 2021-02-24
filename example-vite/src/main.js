import { createApp } from 'vue'
import router from './router.js'
import store from './store.js'
import App from './App.vue'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

// pwa
import '../firebase.config.js'
import '../pwa-init.js'

// our own web components
import '/@es-labs/esm/bwc-loading-overlay.js'

const app = createApp(App)
// console.log('app.config', app.config)
// app.config.isCustomElement = (tag) => {
//   console.log(tag)
//   return tag.startsWith('bwc-') || tag.startsWith('mwc-') || tag.startsWith('vcxwc-')
// }
// app.config.isCustomElement = tag => tag.startsWith('mwc-') // https://zhuanlan.zhihu.com/p/135280049
const theme = 'dark'
// const ThemeSymbol = Symbol()
app.provide('MyTheme', theme) // provide & inject
app.use(store)
app.use(router)
app.use(Antd)

app.mount('#app')
