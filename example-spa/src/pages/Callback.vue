<template>
  <div class="container">
    Logging In... Please Wait...
  </div>
</template>

<script>
import { http } from "@/axios"
export default {
  async mounted () {
    try {
      const { code, state } = this.$route.query
      const { data } = await http.post("/api/auth/check-github", {
        code,
        state
      })
      this.$store.commit('setUser', data) // order of this is important, wrong order can cause logout due to reactivity and calling of mounted...
      await this.$router.push('/dashboard')
      this.$store.commit('setLayout', 'layout-admin')
    } catch (e) {
      this.error = e + ''
    }
  }
};
</script>
