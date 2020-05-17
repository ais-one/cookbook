const template = /*html*/`
<b-navbar v-if="user" type="is-dark">
  <template slot="brand">
    <b-navbar-item tag="router-link" :to="{ path: '/dashboard' }">
      <img src="images/logo.png" alt="MS IoT Dashboard">
    </b-navbar-item>
  </template>
  <template slot="start">
    <b-navbar-dropdown v-if="user && user.role ==='ms'" label="Admin">
      <b-navbar-item tag="router-link" to="admin-users">User</b-navbar-item>
    </b-navbar-dropdown>
  </template>
  <template slot="end">
    <b-navbar-item tag="div">
      <div class="buttons">
        <a class="button is-light" @click="logout">
          {{ user.userRef }}&nbsp;<span class="icon is-small"><i class="mdi mdi-logout"></i></span>
        </a>
      </div>
    </b-navbar-item>
  </template>
</b-navbar>
`

export default {
  template,
  computed: {
    user: function () { return this.$store.getters.user }
  },
  methods: {
    logout () {
      this.$store.commit('setUser', null)
      this.$store.commit('setToken', null)
      localStorage.setItem('ms', null)
      this.$router.push('/')
    }
  }
}
