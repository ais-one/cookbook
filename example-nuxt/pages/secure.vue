<template>
  <div>
    <v-alert show variant="warning">This is a secure page!</v-alert>
    <h1>State</h1>
    <pre>{{ state }}</pre>
    <h1>Scopes</h1>
    <p>
      User: {{ $auth.hasScope('user') }}<br />
      Test: {{ $auth.hasScope('test') }}<br />
      Admin: {{ $auth.hasScope('admin') }}
    </p>
    <h1>Token</h1>
    <pre>{{ $auth.token || '-' }}</pre>
    <hr />
    <v-btn @click="$auth.fetchUser()">Fetch User</v-btn>
    <v-btn @click="$auth.logout()">Logout</v-btn>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  computed: {
    state() {
      return JSON.stringify(this.$auth.$state, undefined, 2)
    }
  }
}
</script>
