<template>
  <v-layout
    column
    justify-center
    align-center>
    <v-flex
      xs12
      sm8
      md6>
      <div class="text-xs-center">
        <!-- <logo/>
        <vuetify-logo/> -->
      </div>
      <v-card>
        <v-card-title class="headline">Welcome to the Vuetify + Nuxt.js template</v-card-title>
        <v-card-text>
          <p>User status: {{ $auth.$state.loggedIn ? 'Logged In' : 'Guest' }}</p>
        </v-card-text>
        <v-card-actions>
          <template v-if="$auth.$state.loggedIn">
            <v-btn color="primary" flat nuxt to="/secure">Secure</v-btn>
            <v-spacer/>
            <v-btn color="default" flat @click="$auth.logout()">Logout</v-btn>
          </template>
          <template v-else>
            <v-btn color="primary" flat nuxt to="/login">Login</v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>



<script>
// import Logo from '~/components/Logo.vue'
// import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  // components: {
  //   Logo,
  //   VuetifyLogo
  // }
}
</script>
