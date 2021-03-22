<template>
  <component :is="$route.meta.layout || 'layout-public'"></component>
</template>

<script>
// :key="$route.fullPath" // this is causing problems
import layoutPublic from './layouts/Public.vue' // store.state.user determines if public or secure
import layoutSecure from './layouts/Secure.vue'

import { computed } from 'vue'
import { useStore } from 'vuex'

import * as http from '/@es-labs/esm/http.js'  // aliased in vite.config.js
import ws from '/@es-labs/esm/ws.js'

import { VITE_API_URL, VITE_WS_URL, VITE_WS_MS, VITE_WITH_CREDENTIALS, VITE_REFRESH_URL } from '/config.js'

import { provideI18n } from '/src/plugins/i18n.js'

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
    // console.log('VITE_API_URL', VITE_API_URL)
    // console.log('VITE_REFRESH_URL', VITE_REFRESH_URL)
    http.setOptions({
      baseUrl: VITE_API_URL,
      refreshUrl: VITE_REFRESH_URL,
      credentials: VITE_WITH_CREDENTIALS || 'same-origin',
      forceLogoutFn: logout
    })
    // TOREMOVE
    // http.setBaseUrl(VITE_API_URL)
    // http.setCredentials(VITE_WITH_CREDENTIALS || 'same-origin')
    // http.setForceLogoutFn(logout)

    // set i18n
    provideI18n({
      locale: 'en',
      messages: {
        en: { sign_in: 'Sign In (en)' },
        id: { sign_in: 'Masuk (id)' }
      }
    })

    // set ws
    ws.endpoint = VITE_WS_URL
    ws.reconnectMs = VITE_WS_MS

    return {
      storeUser // computed
    }
  }
}
</script>
