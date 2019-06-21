<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-xs-center">{{ title }}</div>
      <v-card>
        <v-card-title class="headline">Welcome to the Vuetify + Nuxt.js template</v-card-title>
        <v-card-text>
          <p>User status: {{ $auth.$state.loggedIn ? 'Logged In' : 'Guest' }}</p>
        </v-card-text>
        <v-card-actions>
          <template v-if="$auth.$state.loggedIn">
            <v-btn color="primary" nuxt to="/secure">Secure</v-btn>
            <v-spacer />
            <v-btn color="default" @click="$auth.logout()">Logout</v-btn>
          </template>
          <template v-else>
            <v-btn color="primary" nuxt to="/login">Login</v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
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
