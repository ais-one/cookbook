<template>
  <div class="container">
    <div v-if="!!error" :value="!!error">{{ error }}</div>
    <div v-else>Logging in... Please Wait...</div>
  </div>
</template>

<script>
export default {
  layout: 'minimal',
  data: () => ({
    error: null
  }),
  async mounted() {
    try {
      const { code, state } = this.$route.query
      const { data } = await this.$axios.post('/api/auth/check-github', {
        code,
        state
      })
      this.$store.commit('setUser', data)
      /*
      this.$auth.setToken('social', `Bearer ${data.token}`)
      this.$auth.strategy._setToken(`Bearer ${data.token}`) // this.$axios.defaults.headers.common['Authorization']
      console.log('cb', data)
      const rv = await this.$axios.get('/api/auth/me')
      this.$auth.setStrategy('social')
      console.log('ccbb', rv.data.user)
      this.$auth.setUser(rv.data.user)
      this.$router.push('/secure')
      */
    } catch (e) {
      this.error = e + ''
    }
    // this.$router.push('/secure')
  }
}
</script>

<style scoped>
.container {
  min-height: 70vh;
}
</style>
