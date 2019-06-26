<template>
  <v-container>
    <loading-blocker :loading="loading"></loading-blocker>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container v-if="!(user && !user.verified)">
              <form @submit.prevent="onSignin">
                <v-layout row wrap >
                  <v-flex xs12>
                    <v-text-field label="Username" v-model="email" type="text" required></v-text-field>
                    <v-text-field label="Password" v-model="password" type="password" required></v-text-field>
                    <v-btn type="submit" :disabled="loading||recaptchaUnverified" :loading="loading">Sign in</v-btn>
                    <v-btn type="button" :disabled="loading||recaptchaUnverified" :loading="loading" @click="onFirebaseSignin">Firebase Sign in</v-btn>
                    <v-btn type="button" :disabled="loading||recaptchaUnverified" :loading="loading" @click="onMongoSignin">Mongo Sign in</v-btn>
                    <vue-recaptcha v-if="sitekey" class="g-recaptcha" @verify="onVerify" @expired="onExpired" :sitekey="sitekey"></vue-recaptcha>
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
import VueRecaptcha from 'vue-recaptcha'
import { recaptchaSiteKey } from '../../cfg.json'

import { mapGetters } from 'vuex'
import '../../../src/vcx-loading-blocker.js'

export default {
  components: { VueRecaptcha }, // recaptcha
  data () {
    return {
      recaptchaUnverified: true, // recaptcha
      sitekey: recaptchaSiteKey, // recaptcha
      email: '',
      password: '',
      pin: '' // OTP
    }
  },
  created () {
    // console.log('comment out line below to test Google Recaptcha on localhost')
    if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' || this.sitekey === '') this.recaptchaUnverified = false
  },
  computed: {
    ...mapGetters([ 'user', 'error', 'loading' ])
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
    },
    // BAAS
    onFirebaseSignin () {
      this.$store.dispatch('firebaseSignin', { email: this.email, password: this.password })
    },
    onMongoSignin () {
      this.$store.dispatch('mongoSignin', { email: this.email, password: this.password })
    },
    onVerify (response) { this.recaptchaUnverified = false },
    onExpired () { this.recaptchaUnverified = true }
  }
}
</script>

<style scoped>
@media screen and (max-width: 450px) {
  #rc-imageselect, .g-recaptcha {
    transform:scale(0.77);-webkit-transform:scale(0.77);transform-origin:0 0;-webkit-transform-origin:0 0;
  }
}
/*
.center-all {
  display: flex;
  align-items: center; # V
  justify-content: center; # H
}
.h-center {
  margin-left: auto;
  margin-right: auto;
}
*/
</style>
