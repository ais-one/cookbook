<template>
  <v-app>
    <v-container>
      <v-layout row v-if="error">
        <v-flex xs12 sm6 offset-sm3>
          <v-alert :value="error" color="error">
            <v-btn icon><v-icon @click="onDismissed">close</v-icon></v-btn> {{error.message}}
          </v-alert>
        </v-flex>
      </v-layout>
      <!-- <v-layout row justify-center align-center>
        <v-flex xs12 py-4 class="text-xs-center">
          <v-img src="/static/final.png" class="h-center" max-width="320px" />
        </v-flex>
      </v-layout> -->
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-card-text>
              <v-container>
                <form @submit.prevent="onSignin">
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field name="email" label="Mail" id="email" v-model="email" type="email" required></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field label="Password" v-model="password" type="password" required></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <img src="/static/email.png" />
                    <v-flex xs12>
                      <v-btn type="submit" :disabled="loading||unverified" :loading="loading">
                        Sign in
                        <span slot="loader" class="custom-loader">
                          <v-icon light>cached</v-icon>
                        </span>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-layout row v-if="sitekey">
                    <v-flex xs12>
                      <vue-recaptcha class="g-recaptcha" @verify="onVerify" @expired="onExpired" :sitekey="sitekey"></vue-recaptcha>
                    </v-flex>
                  </v-layout>
                </form>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha'
import { mapGetters } from 'vuex'
import { recaptchaSiteKey } from '../../../cfg.json'
export default {
  components: { VueRecaptcha },
  data () {
    return {
      unverified: true,
      sitekey: recaptchaSiteKey,
      email: '',
      password: ''
    }
  },
  created () {
    // console.log('comment out line below to test Google Recaptcha on localhost')
    if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' || this.sitekey === '') this.unverified = false
  },
  computed: {
    ...mapGetters([ 'user', 'error', 'loading' ])
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        // this.$router.push('/notes')
      } else {
        // this.$router.push('/')
      }
    }
  },
  methods: {
    onSignin () {
      this.$store.dispatch('signUserIn', { email: this.email, password: this.password })
    },
    onDismissed () {
      this.$store.dispatch('clearError')
    },
    onVerify (response) { this.unverified = false },
    onExpired () { this.unverified = true }
  }
}
</script>

<style scoped>
@media screen and (max-width: 450px) {
  #rc-imageselect, .g-recaptcha {
    transform:scale(0.77);-webkit-transform:scale(0.77);transform-origin:0 0;-webkit-transform-origin:0 0;
  }
}
.center-all {
  display: flex;
  align-items: center; /* v */
  justify-content: center; /* h */
}
.h-center {
  margin-left: auto;
  margin-right: auto;
}
</style>
