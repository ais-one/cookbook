<template>
  <v-app>
    <v-container>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-card-text>
              <v-container>
                <form @submit.prevent="onSignin">
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-text-field name="email" label="Mail" id="email" v-model="email" type="email" required></v-text-field>
                      <v-text-field label="Password" v-model="password" type="password" required></v-text-field>
                      <v-btn type="submit" :disabled="loading||unverified" :loading="loading">Firebase Sign in</v-btn>
                      <v-btn type="button" :disabled="loading||unverified" :loading="loading" @click="onMongoSignin">Mongo Sign in</v-btn>
                      <vue-recaptcha v-if="sitekey" class="g-recaptcha" @verify="onVerify" @expired="onExpired" :sitekey="sitekey"></vue-recaptcha>
                      <p v-if="!!error">{{error.message}}</p>
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
    onMongoSignin () {
      this.$store.dispatch('mongoSignin', { email: this.email, password: this.password })
    },
    onDismissed () { // unused
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
