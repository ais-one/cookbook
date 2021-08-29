<template>
  <div>
    <h1>Callback</h1>
    <p>SAML or OIDC or OAuth</p>
    <p>Hash = {{ hash }}</p>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Callback',
  setup(props, context) {
    const route = useRoute()
    const hash = ref('No Hash Found')

    onMounted(async () => {
      // NOSONAR const { hash, href, port, hostname, protocol, ...etc } = window.location
      console.log('Callback mounted!', route.hash, route) // deal with hashes here if necessary
      hash.value = route.hash.substring(1) // <access_token>;<refresh_token>;<groups JSON string>
      // verify first, if ok, do login, else send to forbidden // split(';')
    })

    return {
      hash
    }
  }
}
</script>
