<template>
  <div>
    <h1>Callback</h1>
    <p>SAML</p>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Callback',
  setup(props, context) {
    const route = useRoute()

    onMounted(async () => {
      console.log('Callback mounted!', route.hash, route) // deal with hashes here if necessary
    })

    return {
    }
  }
}
</script>
