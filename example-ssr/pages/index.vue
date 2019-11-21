<template>
  <div class="container">
    <div>
      <h2>{{ title }}</h2>
      <p>User status: {{ loggedIn ? 'Logged In' : 'Guest' }}</p>
      <template v-if="loggedIn">
        <nuxt-link color="primary" to="/secure">Secure</nuxt-link>
        <button color="default" @click="doLogout">Logout</button>
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
      return this.$store.state.user
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
    // decodeURIComponent(this.$route.query.redirect)
    // Boolean(this.$route.query.callback),
  },
  async asyncData({ params, env }) {
    // console.log('iii', params, process.server, env)
    return { title: 'Title After Async Data' }
  },
  methods: {
    doLogout () {
      this.$store.dispatch('logout', { user: this.$store.state.user })
    }
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
