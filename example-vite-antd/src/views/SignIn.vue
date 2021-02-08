<template>
  <div class="super-center-parent" >
    <a-button type="primary" html-type="button" @click="login">Log in</a-button>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

// import { samlLogin } from '../../../common-lib/esm/saml.js' // served from express /esm static route

import { VITE_CALLBACK_URL } from '/config.js'

export default {
  setup(props, context) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const loading = ref(false)
    const errorMessage = ref('')
    const mode = ref('login') // login, otp

    const callbackUrl = VITE_CALLBACK_URL

    onUnmounted(() => console.log('signIn unmounted'))
    onMounted(async () => {
      console.log('signIn mounted!', route.hash) // deal with hashes here if necessary
      errorMessage.value = ''
      loading.value = false
    })

    onBeforeUnmount(() => {
    })

    const _setUser = async () => {
      await store.dispatch('doLogin', 'Demu User') // store user
    }

    const login = async () => {
      _setUser()
      loading.value = false
      router.push('/dashboard')
    }

    return {
      // samlLogin,
      login,
      errorMessage,
      loading,
      mode,
      callbackUrl
    }
  }
}
</script>

<style>
.super-center-parent {
  display: grid;
  place-items: center;
  width: 100vw;
  height: 100vh;
}
</style>
