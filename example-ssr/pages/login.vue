<template>
  <div class="container">
    <!-- <div v-if="!(user && !user.verified)"> -->
    <div v-if="otpCount <= 0">
      <form>
        <div>
          <div>
            <input label="Email" v-model="email" type="text" required />
          </div>
          <div>
            <input label="Password" v-model="password" type="password" required />
          </div>
          <div>
            <button @click="login" :disabled="loading" :loading="loading">Sign In</button>
          </div>
        </div>
      </form>
      <button @click="loginGithub">Login with Github</button>
      <p v-if="!!error" :value="!!error">{{ error }}</p>
      <p show v-if="$auth.$state.redirect">
        You have to login before accessing to <strong>{{ $auth.$state.redirect }}</strong>
      </p>
    </div>
    <div v-else>
      <form @submit.prevent="otp">
        <input label="Enter Your 6-digit OTP" v-model="pin" type="number" maxlength="6" required clearable />
        <button type="submit" :disabled="loading" :loading="loading">Verify OTP</button>
        <p v-if="!!error" :value="!!error">{{ error }}</p>
        <p show v-if="$auth.$state.redirect">
          You have to login before accessing to <strong>{{ $auth.$state.redirect }}</strong>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { GITHUB_CLIENT_ID } from '@/config'
export default {
  middleware: ['auth'],
  data() {
    return {
      otpCount: 0,
      pin: '',
      loading: false,
      disabled: false,
      email: '',
      username: '',
      password: '',
      error: null
    }
  },
  computed: {
    // strategies: () => [
    //   { key: 'auth0', name: 'Auth0', color: '#ec5425' },
    //   { key: 'google', name: 'Google', color: '#4284f4' },
    //   { key: 'facebook', name: 'Facebook', color: '#3c65c4' },
    //   { key: 'github', name: 'GitHub', color: '#202326' }
    // ],
    redirect() {
      return this.$route.query.redirect && decodeURIComponent(this.$route.query.redirect)
    },
    isCallback() {
      return Boolean(this.$route.query.callback)
    }
  },
  created() {
    // console.log(process.env.USE_OTP)
    console.log('GITHUB_CLIENT_ID', GITHUB_CLIENT_ID)
  },
  methods: {
    async loginGithub() {
      if (!GITHUB_CLIENT_ID) {
        return alert(
          'Github Client ID required in environment file...\n' +
            'Please also set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in backend environment file'
        )
      }
      window.location.replace('https://github.com/login/oauth/authorize?scope=user:email&client_id=' + 'a355948a635c2a2066e2')
    },
    async login() {
      this.error = null
      try {
        const { data } = await this.$axios.post('/api/auth/login', {
          email: this.email, // username
          password: this.password
        })
        this.$auth.setToken('local', `Bearer ${data.token}`)
        this.$auth.strategy._setToken(`Bearer ${data.token}`) // this.$axios.defaults.headers.common['Authorization']
        console.log('sss', process.env.USE_OTP)
        if (process.env.USE_OTP) {
          this.otpCount = 3 // 3 tries
        } else {
          const rv = await this.$axios.get('/api/auth/me')
          this.$auth.setUser(rv.data)
          this.$router.push('/secure')
        }
      } catch (e) {
        this.error = e + ''
      }
    },
    async otp() {
      if (this.otpCount <= 0) return
      this.error = null
      try {
        const { data } = await this.$axios.post('/api/auth/otp', {
          pin: this.pin
        })
        this.$auth.setToken('local', `Bearer ${data.token}`)
        this.$auth.strategy._setToken(`Bearer ${data.token}`) // this.$axios.defaults.headers.common['Authorization']
        const rv = await this.$axios.get('/api/auth/me')
        this.$auth.setUser(rv.data)
        this.$router.push('/secure')
      } catch (e) {
        // console.log('otp err', this.otpCount)
        this.otpCount--
        this.error = e + ''
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
