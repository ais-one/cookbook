
<template>
  <div class="container">
    <h1>Hello Vite + Vue 3!</h1>
    <button @click="signIn">Sign In</button>
    <button @click="signUp">Sign Up</button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Home',
  setup(props, context) {
    const router = useRouter()

    const signIn = async () => await router.push('/signin')
    const signUp = async () => await router.push('/signup')
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
