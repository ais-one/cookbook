<template>
  <div class="container d-flex align-items-center justify-content-center flex-column">
    <!-- <img src="~/assets/loading.svg" alt="Loading..." width="80px" /> -->
    Logging in...
    <v-alert v-if="!!error" :value="!!error" type="error">{{ error }}</v-alert>
  </div>
</template>

<script>
export default {
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
      this.$auth.setToken('social', `Bearer ${data.token}`)
      this.$auth.strategy._setToken(`Bearer ${data.token}`) // this.$axios.defaults.headers.common['Authorization']
      console.log('cb', data)
      const rv = await this.$axios.get('/api/auth/me')
      this.$auth.setStrategy('social')
      this.$auth.setUser(rv.data.user)
      this.$router.push('/secure')
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
