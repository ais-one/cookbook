<template>
  <div>
    <h1>This is a secure page! - State</h1>
    <pre>{{ user.id }}</pre>
    <h1>Scopes</h1>
    <h1>Tokens</h1>
    <pre>{{ user.token || '-' }}</pre>
    <pre>{{ user.refresh_token || '-' }}</pre>
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
      this.$store.state.user
    }
  },
  methods: {
    fetchUser () {
    },
    doLogout () {
      this.$store.dispatch('logout', { user: this.$store.state.user })
    }
  }
}
</script>
