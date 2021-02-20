import { createApp } from 'vue'
import router from './router.js'
import store from './store.js'
import App from './App.vue'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)
app.config.productionTip = false
app.use(store)
app.use(router)
app.use(Antd)

app.mount('#app')
