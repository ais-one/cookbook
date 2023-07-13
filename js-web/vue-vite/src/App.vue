<template>
  <component :is="$route.meta.layout || (storeUser ? 'layout-secure' : 'layout-public')"></component>
</template>

<script>
// :key="$route.fullPath" // this is causing problems
import { LAYOUTS } from '../config.js'

import { computed } from 'vue'
import { useMainStore } from '/src/store'

import { http } from '/src/services.js'
import { provideI18n } from '/src/plugins/i18n.js'

export default {
  components: {
    'layout-public': LAYOUTS.layoutPublic, // store.user determines if public or secure
    'layout-secure': LAYOUTS.layoutSecure
  },
  setup(props, context) {
    const store = useMainStore()
    const storeUser = store.state
    const logout = async () => {
      await store.doLogin({ forced: true })
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
