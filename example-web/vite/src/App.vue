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

import { provideXhr } from './plugins/xhr.js'
import * as http from '/src/lib/esm/http.js'

import { VITE_API_URL, VITE_WITH_CREDENTIALS } from '/config.js'

export default {
  components: {
    layoutPublic,
    layoutSecure
  },
  setup(props, context) {
    const store = useStore()
    const storeUser = computed(() => store.state.user)

    // const logout = async () => await store.dispatch('doLogin', { forced: true })
    http.setBaseUrl(VITE_API_URL)
    http.setCredentials(VITE_WITH_CREDENTIALS || 'same-origin')
    // http.setForceLogoutFn(logout)
    provideXhr(http)
    return {
      storeUser // computed
    }
  }
}
</script>
