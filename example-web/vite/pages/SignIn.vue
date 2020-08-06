
<template>
  <div class="container">
    <h1>Sign In</h1>
    Enter Username <input type="text" v-model="username" />
    <button @click="login">Login</button>
    <p>[<router-link to="/">Home</router-link>]</p>
  </div>
</template>

<script>
import { onMounted, onUpdated, onUnmounted, onBeforeUnmount, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default {
  setup(props, context) {
    const store = useStore()
    
    const username = ref('Test')
    const login = () => store.dispatch('doLogin', username.value)
    return {
      username, // data
      login, // method
    }
  }
}
</script>

<style scoped>
h1 {
  color: #4fc08d;
}

h1, p {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
