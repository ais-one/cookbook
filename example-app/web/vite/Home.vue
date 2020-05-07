<template>
  <div>
    [<router-link to="/site-a">Site A</router-link>] [<router-link to="/site-b">Site B</router-link>]
    <h1>A Hello Vite + Vue 3!</h1>
    <p>Edit ./App.vue to test hot module replacement (HMR).</p>
    <p>
      <span>Count is: {{ count }}</span>
      <button @click="count++">increment</button>
    </p>
    <p>Vuex Store {{ $store.state.count }}</p>
    <p>Axios GET {{ msg }}</p>
  </div>
</template>

<script>
import axios from '/web_modules/axios.js'

export default {
  name: 'Home',
  data: () => ({ count: 0, msg: '' }),
  async mounted () {
    console.log('mounted')
    const rv = await axios.get('https://swapi.dev/api/people/1')
    this.msg = JSON.stringify(rv.data)
    console.log(this.$router, this.$store)
  },
  created () {
    console.log('created')
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
