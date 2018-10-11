<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <!-- <v-img src="/static/logo-main.png" /> -->
              <form @submit.prevent="onSignup">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Mail" v-model="email" type="email" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Password" v-model="password" type="password" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Confirm Password" v-model="confirmPassword" type="password" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12 class="text-xs-center">
                    <v-btn type="submit" :disabled="loading" :loading="loading">Sign up
                      <span slot="loader" class="custom-loader"><v-icon light>cached</v-icon></span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  computed: {
    comparePasswords () {
      return this.password !== this.confirmPassword ? 'Passwords do not match' : ''
    },
    // can use vuex mapGetters
    user () { return this.$store.getters.user },
    error () { return this.$store.getters.error },
    loading () { return this.$store.getters.loading }
  },
  methods: {
    onSignup () {
      this.$store.dispatch('signUserUp', { email: this.email, password: this.password })
    }
  }
}
</script>
