<template>
  <v-container>
    <loading-blocker :loading="loading"></loading-blocker>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h2 class="text-center">Sign In (V{{ version }})</h2>
        <v-card>
          <v-card-text>
            <v-container v-if="!(user && !user.verified)">
              <form @submit.prevent="onSignin">
                <v-layout row wrap >
                  <v-flex xs12>
                    <v-text-field label="Username" v-model="email" type="text" required></v-text-field>
                    <v-text-field label="Password" v-model="password" type="password" required></v-text-field>
                    <v-btn class="ma-1" type="submit" :disabled="loading" :loading="loading">Sign in</v-btn>
                    <p v-if="!!error">{{ error.message }}</p>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
            <v-container v-else>
              <form @submit.prevent="onVerifyOtp">
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field label="Enter Your 6-digit OTP" v-model="pin" type="number" maxlength="6" required clearable></v-text-field>
                    <v-btn type="submit" :disabled="loading" :loading="loading">Verify OTP</v-btn>
                     <p v-if="!!error">{{ error.message }}</p>
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
import { mapState } from 'vuex'
import 'ext-lib/webpacked/vcx-loading-blocker.js'
import { APP_VERSION } from '@/config'

export default {
  data () {
    return {
      version: APP_VERSION,
      email: '',
      password: '',
      pin: '' // OTP
    }
  },
  created () {
  },
  computed: {
    ...mapState([ 'user', 'error', 'loading' ])
  },
  // watch: {
  //   user (value) {
  //     if (value !== null && value !== undefined) {
  //       // this.$router.push('/notes')
  //     } else {
  //       // this.$router.push('/')
  //     }
  //   }
  // },
  methods: {
    // REST
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

<style scoped>
</style>
