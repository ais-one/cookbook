<template>
  <div>
    <h1>This is a secure page! - State</h1>
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
    <button @click="$auth.fetchUser()">Fetch User</button>
    <button @click="$auth.logout()">Logout</button>
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
