<template>
  <div class="page-flex">
    <bwc-loading-overlay v-if="loading"></bwc-loading-overlay>
    <form class="form-box-flex">
      <div v-show="mode === 'login'">
        <h1>{{ i18n.$t('sign_in') }}</h1>
        <mwc-textfield label="Username" outlined type="text" v-model="email"></mwc-textfield>
        <mwc-textfield label="Password" outlined type="password" v-model="password"></mwc-textfield>
        <div class="buttons-box-flex">
          <mwc-button raised label="Login" type="button" @click="login"></mwc-button>
          <mwc-button raised label="SAML" type="button" @click="() => samlLogin(callbackUrl)"></mwc-button>
        </div>
        <p><router-link to="/signup">Sign Up</router-link></p>
      </div>
      <div v-show="mode === 'otp'">
        <h1>Enter OTP</h1>
        <mwc-textfield label="OTP" outlined type="text" v-model="otp"></mwc-textfield>
        <div class="buttons-box-flex">
          <mwc-button raised label="OTP" type="button" @click="otpLogin"></mwc-button>
        </div>
      </div>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import { useXhr } from '/src/plugins/xhr.js'
import { useI18n } from '/src/plugins/i18n.js'
import { useWs } from '/src/plugins/ws.js'

import parseJwt from '../../../@es-labs/esm/parse-jwt.js' // served from express /esm static route
import { samlLogin } from '../../../@es-labs/esm/saml.js'
import apollo from '/lib/esm-rollup/apollo.js' // may not need to use provide/inject if no reactivity ? // served from express /esm static route
import { DO_HELLO } from '/src/queries.js'

import { VITE_CALLBACK_URL } from '/config.js'

const apolloClient = apollo.get()
if (apolloClient) {
  apolloClient // apollo test
    .query({
      query: DO_HELLO, // gql`query DoHello($message: String!) { hello(message: $message) }`,
      variables: {
        message: 'Meow'
      }
    })
    .then((data) => console.log('graphql', data))
    .catch((error) => console.error(error))
}

export default {
  setup(props, context) {
    const store = useStore()
    const route = useRoute()

    const http = useXhr()
    const i18n = useI18n()
    const ws = useWs()

    const loading = ref(false)
    const email = ref('test')
    const password = ref('test')
    const errorMessage = ref('')
    const mode = ref('login') // login, otp
    const otp = ref('')

    const callbackUrl = VITE_CALLBACK_URL

    let otpCount = 0
    let timerId = null

    const setToLogin = () => {
      mode.value = 'login' // ui-reactive...
      otp.value = ''
      // email.value = ''
      // password.value = ''
      otpCount = 0 // non-ui-reactive
    }

    onUnmounted(() => console.log('signIn unmounted'))
    onMounted(async () => {
      console.log('signIn mounted!', route.hash) // deal with hashes here if necessary

      setToLogin()
      otp.value = '111111'
      errorMessage.value = ''
      loading.value = false

      ws.connect()
      const wsHandler = (e) => console.log('ws onmessage', e.data)
      ws.setMessage(wsHandler)

      timerId = setInterval(async () => {
        if (ws) {
          console.log('ws interval - send')
          ws.send('Hello ' + new Date())
          // if (navigator.onLine) this.updateNetworkError(false)
          // else this.updateNetworkError(true)
        } else {
          console.log('ws falsy')
        }
      }, 10000)
    })

    onBeforeUnmount(() => {
      // console.log('signIn onBeforeUnmount')
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      }
      if (ws) ws.setMessage(null)
      ws.close()
    })

    const _setUser = async (data, decoded) => {
      await store.dispatch('doLogin', decoded) // store user
      // id, verified, groups, token, refresh_token
    }

    const login = async () => {
      console.log('login clicked')
      if (loading.value) return
      loading.value = true
      errorMessage.value = ''
      try {
        const { data } = await http.post('/api/auth/login', {
          email: email.value,
          password: password.value
        })
        const decoded = parseJwt(data.token)
        http.setToken(data.token)
        http.setRefreshToken(data.refresh_token)
        if (decoded.verified) {
          _setUser(data, decoded)
        } else {
          // OTP
          mode.value = 'otp'
          otpCount = 0
        }
      } catch (e) {
        console.log('login error', e.toString())
        errorMessage.value = e.data ? e.data.message : JSON.stringify(e)
      }
      loading.value = false
    }

    const otpLogin = async () => {
      if (loading.value) return
      loading.value = true
      errorMessage.value = ''
      try {
        const { data } = await http.post('/api/auth/otp', { pin: otp.value })
        const decoded = parseJwt(data.token)
        http.setToken(data.token)
        http.setRefreshToken(data.refresh_token)
        if (decoded.verified) {
          _setUser(data, decoded)
        }
      } catch (e) {
        if (e.data.message === 'Token Expired Error') {
          errorMessage.value = 'OTP Expired'
          setToLogin()
        } else if (otpCount < 3) {
          otpCount++
          errorMessage.value = 'OTP Error'
        } else {
          errorMessage.value = 'OTP Tries Exceeded'
          setToLogin()
        }
      }
      loading.value = false
    }

    return {
      samlLogin,
      email, // data
      password,
      errorMessage,
      loading,
      mode,
      otp,
      login, // method
      otpLogin,
      i18n,
      callbackUrl
    }
  }
}
</script>

<style scoped>
.page-flex h1,
.page-flex p {
  text-align: center;
}

.page-flex {
  display: flex;
  flex-direction: row;
  height: calc(100vh);
  justify-content: center;
  align-items: center;
}

.form-box-flex > div {
  /* height: 320px; */
  width: 320px;

  display: flex;
  flex-direction: column;
  flex: 0 0 auto;

  border: 1px solid;
  border-radius: 5px;
  padding: 15px;
  background: lightgray;
}

.form-box-flex > div > mwc-textfield,
.form-box-flex > div > .buttons-box-flex {
  margin-top: 15px;
}

.form-box-flex > div > mwc-textfield {
  flex: 1 1 auto;
  font-size: 20px;
}

.buttons-box-flex {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.buttons-box-flex > div > mwc-button {
  flex: 0 1 95px;
  font-size: 20px;
}
</style>
