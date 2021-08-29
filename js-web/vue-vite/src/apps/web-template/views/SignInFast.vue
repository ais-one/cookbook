<template>
  <div class="super-center-parent" >
    <a-result title="Welcome To JS Dashboard" sub-title="Your one-stop web portal for all things web">
      <template #icon>
        <a-image :width="150" src="https://via.placeholder.com/150x150.png?text=A+Logo" />
      </template>
      <template #extra>
        <a-button type="primary" html-type="button" @click="login">Log in</a-button>
      </template>
    </a-result>
  </div>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { INITIAL_SECURE_PATH } from '/config.js'

export default {
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    onUnmounted(() => console.log('signInFast unmounted'))
    onMounted(async () => {
      console.log('signInFast mounted!', route.hash) // deal with hashes here if necessary
    })

    const _setUser = async () => {
      const decoded = {
        id: 'Aaa',
        groups: 'MyGroup,AnotherGroup'
      }
      await store.dispatch('doLogin', decoded) // store user
    }
    const login = async () => {
      _setUser()
      router.push(INITIAL_SECURE_PATH)
    }

    return {
      login
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
