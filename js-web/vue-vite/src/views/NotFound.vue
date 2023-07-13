<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary" @click="goHome">Back Home</a-button>
    </template>
  </a-result>
</template>

<script>
import { useRouter } from 'vue-router'
const store = useMainStore()
import { INITIAL_SECURE_PATH, INITIAL_PUBLIC_PATH } from '/config.js'

export default {
  name: 'NotFound',
  setup(props, context) {
    const router = useRouter()
    const store = useMainStore()
    const goHome = () => router.push(store.user ? INITIAL_SECURE_PATH : INITIAL_PUBLIC_PATH)
    return {
      goHome
    }
  }
}
</script>
