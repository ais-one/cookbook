<template>
<div class="container d-flex align-items-center justify-content-center flex-column">
  <!-- <img src="~/assets/loading.svg" alt="Loading..." width="80px" /> -->
  Logging in...
</div>
</template>

<script>
// GET /applications/:client_id/tokens/:access_token
export default {
  async mounted() {
    // console.log('CB', this.$route.query.state)
    // console.log('ACB', this.$auth.loggedIn)
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
