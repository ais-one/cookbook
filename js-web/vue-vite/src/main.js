import { createApp } from 'vue'
import router from './router.js'
import store from './store.js'
import { createPinia } from 'pinia'
import App from './App.vue'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// import 'ant-design-vue/dist/antd.dark.css'

// Sentry
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

// pwa
import '../firebase.config.js'
import '../pwa-init.js'

// our own web components
import '/@es-labs/esm/bwc-loading-overlay.js'

const app = createApp(App)
// NOSONAR
// https://zhuanlan.zhihu.com/p/135280049
// app.config.isCustomElement = (tag) => tag.startsWith('bwc-') || tag.startsWith('vcxwc-')

Sentry.init({
  app,
  dsn: 'https://3326314072fc4706bf8492e292b674b2@o406131.ingest.sentry.io/5869551',
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['localhost', 'my-site-url.com', /^\//]
    })
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// Sentry.captureMessage('Something went wrong Vue Vute' + Date.now())

const theme = 'dark'
// const ThemeSymbol = Symbol()
app.provide('MyTheme', theme) // provide & inject
app.use(store)
app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
