<template>
  <div class="container">
    <div>
      <h2>{{ title }}</h2>
      <p>User status: {{ $auth.$state.loggedIn ? 'Logged In' : 'Guest' }}</p>
      <template v-if="$auth.$state.loggedIn">
        <nuxt-link color="primary" to="/secure">Secure</nuxt-link>
        <button color="default" @click="$auth.logout()">Logout</button>
      </template>
      <template v-else>
        <nuxt-link color="primary" to="/login">Login</nuxt-link>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    loggedIn() {
      // return this.$store.state.auth.loggedIn
      return this.$store.state.auth.user
    }
  },
  watch: {
    loggedIn: {
      handler: function(after, before) {},
      deep: true
    }
  },
  data: () => ({
    title: 'Title Before Async Data'
  }),
  created() {
    // this.$auth.loggedIn
    // decodeURIComponent(this.$route.query.redirect)
    // Boolean(this.$route.query.callback),
  },
  async asyncData({ params, env }) {
    // console.log('iii', params, process.server, env)
    return { title: 'Title After Async Data' }
  }
  // async fetch ({ store, params }) {
  //   await store.dispatch('GET_STARS');
  // }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
