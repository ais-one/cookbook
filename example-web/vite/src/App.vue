<template>
  <layout-secure v-if="storeToken" />
  <layout-public v-else />
</template>

<script>
// :key="$route.fullPath" // this is causing problems
import layoutPublic from './layouts/Public.vue'
import layoutSecure from './layouts/Secure.vue'

import { computed } from 'vue'
import { useStore } from 'vuex'

import { provideXhr } from './plugins/xhr.js'
import * as http from '/src/lib/esm/http.js'

export default {
  components: {
    layoutPublic,
    layoutSecure
  },
  setup(props, context) {
    const store = useStore()
    const storeToken = computed(() => store.state.token)
    provideXhr(http)
    return {
      storeToken // computed
    }
  }
}
</script>
