<template>
  <a-result status="403" title="403" sub-title="Sorry, you are not authorized to access this page.">
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
  name: 'NotAllowed',
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
