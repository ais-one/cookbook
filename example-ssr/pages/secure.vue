<template>
  <div>
    <h1>This is a secure page! - State</h1>
    <pre>{{ user.id }}</pre>
    <h1>Scopes</h1>
    <h1>Tokens</h1>
    <pre>{{ user.token || '-' }}</pre>
    <pre>{{ user.refresh_token || '-' }}</pre>
    <pre>{{ me }}</pre>
    <hr />
    <button @click="fetchUser">Fetch User</button>
    <button @click="doLogout">Logout</button>
  </div>
</template>

<script>
export default {
  middleware: ['auth-guard'],
  computed: {
    user() {
      if (!this.$store.state.user) return {
        id: 'id-na',
        token: 'token-na',
        refresh_token: 'refresh_token-na'
      }
      return this.$store.state.user
    }
  },
  data () {
    return {
      me: 'none'
    }
  },
  methods: {
    async fetchUser () {
      try {
        const rv = await this.$http.get('/api/auth/me')
        console.log(rv.data)
        this.me = rv.data
      } catch (e) {
        console.log(e.toString())
      }
    },
    doLogout () {
      this.$store.dispatch('logout', { user: this.$store.state.user })
    }
  }
}
</script>
