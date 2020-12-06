<template>
  <component :is="$route.meta.layout || 'layout-public'"></component>
</template>

<script>
// :key="$route.fullPath" // this is causing problems
import layoutPublic from './layouts/Public.vue' // store.state.user determines if public or secure
import layoutSecure from './layouts/Secure.vue'

import { computed } from 'vue'
import { useStore } from 'vuex'

import { provideXhr } from '/src/plugins/xhr.js'
import * as http from '../../common-lib/esm/http.js' // served from express /esm static route
import ws from '../../common-lib/esm/ws.js' // served from express /esm static route

import { VITE_API_URL, VITE_WS_URL, VITE_WS_MS, VITE_WITH_CREDENTIALS, VITE_GQL_URI, VITE_GWS_URI } from '/config.js'

import { provideI18n } from '/src/plugins/i18n.js'
import { provideWs } from '/src/plugins/ws.js'
import apollo from '/lib/esm-rollup/apollo.js' // served from express /esm static route

apollo.init({
  gwsUri: VITE_GWS_URI,
  gqlUri: VITE_GQL_URI
})

export default {
  components: {
    'layout-public': layoutPublic,
    'layout-secure': layoutSecure
  },
  setup(props, context) {
    const store = useStore()
    const storeUser = computed(() => store.state.user)
    const logout = async () => {
      await store.dispatch('doLogin', { forced: true })
    }

    // set http
    console.log('VITE_API_URL', VITE_API_URL)
    http.setBaseUrl(VITE_API_URL)
    http.setCredentials(VITE_WITH_CREDENTIALS || 'same-origin')
    http.setForceLogoutFn(logout)
    provideXhr(http)

    // set i18n
    provideI18n({
      locale: 'en',
      messages: {
        en: { sign_in: 'Sign In (en) v0.0.1a' },
        id: { sign_in: 'Masuk (id) v0.0.1a' }
      }
    })

    // set ws
    ws.endpoint = VITE_WS_URL
    ws.reconnectMs = VITE_WS_MS
    provideWs(ws)

    return {
      storeUser // computed
    }
  }
}
</script>
