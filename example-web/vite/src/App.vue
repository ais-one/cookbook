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

export default {
  components: {
    layoutPublic,
    layoutSecure
  },
  setup(props, context) {
    const store = useStore()
    const storeToken = computed(() => store.state.token)
    
    return {
      storeToken // computed
    }
  }
}
</script>
