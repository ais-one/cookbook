<template>
  <div class="container">
    <!-- <div v-if="!(user && !user.verified)"> -->
    <div>
      <button @click="loginGithub">Login with Github</button>
      <p v-if="!!error" :value="!!error">{{ error }}</p>
      <!-- <p show v-if="$auth.$state.redirect">
        You have to login before accessing to <strong>{{ $auth.$state.redirect }}</strong>
      </p> -->
    </div>
  </div>
</template>

<script>
import { GITHUB_CLIENT_ID } from '@/config'
export default {
  middleware: ['auth'],
  data() {
    return {
      loading: false,
      disabled: false,
      error: null
    }
  },
  computed: {
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
      window.location.replace('https://github.com/login/oauth/authorize?scope=user:email&client_id=' + GITHUB_CLIENT_ID)
    },
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
