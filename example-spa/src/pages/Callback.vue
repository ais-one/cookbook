<template>
  <div class="container">
    <div v-if="!!error" :value="!!error">{{ error }}</div>
    <div v-else>Logging in... Please Wait...</div>
  </div>
</template>

<script>
import { http } from "@/axios";
export default {
  data() {
    return {
      error: null
    }
  },
  async mounted() {
    try {
      const { code, state } = this.$route.query;
      const { data } = await http.post("/api/auth/check-github", {
        code,
        state
      });
      this.$store.commit("setUser", data);
      console.log("github", data);
    } catch (e) {
      this.error = e + "";
    }
    // this.$router.push('/secure')
  }
};
</script>
