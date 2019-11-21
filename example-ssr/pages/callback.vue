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
      const { data } = await this.$http.post('/api/auth/check-github', {
        code,
        state
      })
      this.$store.commit('setUser', data)
      await this.$router.push('/secure')
    } catch (e) {
      this.error = e.toString() + ''
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 70vh;
}
</style>
