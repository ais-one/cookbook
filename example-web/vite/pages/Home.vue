
<template>
  <div class="container">
    <!-- [<router-link to="/site-a">Site A</router-link>] [<router-link to="/site-b">Site B</router-link>] -->
    <h1>Hello Vite + Vue 3!</h1>
    <button @click="signIn">Sign In</button>
    <button @click="signUp">Sign Up</button>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'Home',
  setup(props, context) {
    const route = useRoute()
    const router = useRouter()

    const signIn = () => router.push('/signin')
    const signUp = () => router.push('/signup')
    return {
      signIn, // method
      signUp
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
