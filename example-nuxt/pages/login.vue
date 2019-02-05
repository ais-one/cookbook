<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
        </v-card>
        <v-card>
          <v-card-text>
            <!-- <v-container v-if="!(user && !user.verified)"> -->
            <v-container v-if="true">
              <!-- <v-img src="/static/logo-main.png" /> -->
              <form @keydown.enter="login">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Email" v-model="email" type="text" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Password" v-model="password" type="password" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12 class="text-xs-center">
                    <v-btn @click="login" :disabled="loading" :loading="loading">Sign In
                      <span slot="loader" class="custom-loader"><v-icon light>cached</v-icon></span>
                    </v-btn>
                    <!-- <v-btn type="submit" :disabled="loading" :loading="loading">Sign in
                      <span slot="loader" class="custom-loader"><v-icon light>cached</v-icon></span>
                    </v-btn> -->
                  </v-flex>
                </v-layout>
                <v-alert v-if="!!error" :value="!!error" type="error">{{ error.message }}</v-alert>
                <v-alert show v-if="$auth.$state.redirect">You have to login before accessing to <strong>{{ $auth.$state.redirect }}</strong></v-alert>
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
                <v-alert v-if="!!error" :value="!!error" type="error">{{ error.message }}</v-alert>
                <v-alert show v-if="$auth.$state.redirect">You have to login before accessing to <strong>{{ $auth.$state.redirect }}</strong></v-alert>
              </form>
            </v-container>
            <div v-for="s in strategies" :key="s.key" class="mb-2">
              <v-btn @click="$auth.loginWith(s.key)" block :style="{background: s.color}" class="login-button">Login with {{ s.name }}</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<style scoped>
.login-button {
  border: 0;
}
</style>

<script>
import busyOverlay from '~/components/busy-overlay'
export default {
  middleware: ['auth'],
  components: { busyOverlay },
  data() {
    return {
      loading: false,
      disabled: false,
      email: '',
      username: '',
      password: '',
      error: null
    }
  },
  computed: {
    strategies: () => [
      { key: 'auth0', name: 'Auth0', color: '#ec5425' },
      { key: 'google', name: 'Google', color: '#4284f4' },
      { key: 'facebook', name: 'Facebook', color: '#3c65c4' },
      { key: 'github', name: 'GitHub', color: '#202326' }
    ],
    redirect() {
      return (
        this.$route.query.redirect &&
        decodeURIComponent(this.$route.query.redirect)
      )
    },
    isCallback() {
      return Boolean(this.$route.query.callback)
    }
  },
  methods: {
    async login() {
      this.error = null
      return this.$auth
        .loginWith('local', {
          data: {
            email: this.email, // username
            password: this.password
          }
        })
        .catch(e => {
          this.error = e + ''
        })
    }
  }
}
</script>
