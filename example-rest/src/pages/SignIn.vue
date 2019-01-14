<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
        </v-card>
        <v-card>
          <v-card-text>
            <v-container v-if="!(user && !user.verified)">
              <!-- <v-img src="/static/logo-main.png" /> -->
              <form @submit.prevent="onSignin">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Username" v-model="email" type="text" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Password" v-model="password" type="password" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12 class="text-xs-center">
                    <v-btn type="submit" :disabled="loading" :loading="loading">Sign in
                      <span slot="loader" class="custom-loader"><v-icon light>cached</v-icon></span>
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-alert v-if="!!error"
                  :value="!!error"
                  type="error"
                >
                  {{ error.message }}
                </v-alert>
              </form>
            </v-container>
            <v-container v-else>
              <form @submit.prevent="onVerifyOtp">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Enter Your 6-digit OTP" v-model="pin" type="number" maxlength="6" required clearable></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12 class="text-xs-center">
                    <v-btn type="submit" :disabled="loading" :loading="loading">Verify OTP
                      <span slot="loader" class="custom-loader"><v-icon light>cached</v-icon></span>
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-alert v-if="!!error"
                  :value="!!error"
                  type="error"
                >
                  {{ error.message }}
                </v-alert>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      email: '',
      password: '',
      pin: ''
    }
  },
  created () {
  },
  computed: {
    ...mapGetters([ 'user', 'error', 'loading' ])
  },
  methods: {
    onSignin () {
      this.$store.dispatch('clearError')
      this.$store.dispatch('signUserIn', { email: this.email, password: this.password })
    },
    onVerifyOtp () {
      this.$store.dispatch('clearError')
      this.$store.dispatch('verifyOtp', { pin: this.pin })
    }
  }
}
</script>
