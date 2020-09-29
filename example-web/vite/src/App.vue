<template>
  <layout-secure v-if="storeUser" />
  <layout-public v-else />
</template>

<script>
// :key="$route.fullPath" // this is causing problems
import layoutPublic from './layouts/Public.vue' // store.state.user determines if public or secure
import layoutSecure from './layouts/Secure.vue'

import { computed } from 'vue'
import { useStore } from 'vuex'

import { provideXhr } from '/src/plugins/xhr.js'
import * as http from '/src/lib/esm/http.js'

import { VITE_API_URL, VITE_WITH_CREDENTIALS } from '/config.js'

import { provideI18n } from '/src/plugins/i18n.js'
import { provideWs } from '/src/plugins/ws.js'

export default {
  components: {
    layoutPublic,
    layoutSecure
  },
  setup(props, context) {
    const store = useStore()
    const storeUser = computed(() => store.state.user)
    const logout = async () => {
      await store.dispatch('doLogin', { forced: true })
    }

    // set http
    http.setBaseUrl(VITE_API_URL)
    http.setCredentials(VITE_WITH_CREDENTIALS || 'same-origin')
    http.setForceLogoutFn(logout)
    provideXhr(http)

    // set i18n
    provideI18n({
      locale: "en",
      messages: {
        en: { sign_in: "Sign In (en)" },
        id: { sign_in: "Masuk (id)" }
      }
    })

    // set ws
    provideWs()

    return {
      storeUser // computed
    }
  }
}
</script>
