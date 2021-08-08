<template>
  <component :is="$route.meta.layout || (storeUser ? 'layout-secure' : 'layout-public')"></component>
</template>

<script>
// :key="$route.fullPath" // this is causing problems
// import layoutPublic from './layouts/Public.vue' // store.state.user determines if public or secure
// import layoutSecure from './layouts/Secure.vue'
import { LAYOUTS } from '../config.js'

import { computed } from 'vue'
import { useStore } from 'vuex'

import { http } from '/src/services.js'
import { provideI18n } from '/src/plugins/i18n.js'

export default {
  components: {
    'layout-public': LAYOUTS.layoutPublic,
    'layout-secure': LAYOUTS.layoutSecure
    // 'layout-public': layoutPublic,
    // 'layout-secure': layoutSecure
  },
  setup(props, context) {
    const store = useStore()
    const storeUser = computed(() => store.state.user)
    const logout = async () => {
      await store.dispatch('doLogin', { forced: true })
    }
    http.setOptions({ forceLogoutFn: logout })

    // set i18n
    provideI18n({
      locale: 'en',
      messages: {
        en: { sign_in: 'Sign In (en)' },
        id: { sign_in: 'Masuk (id)' }
      }
    })

    return {
      storeUser // computed
    }
  }
}
</script>
