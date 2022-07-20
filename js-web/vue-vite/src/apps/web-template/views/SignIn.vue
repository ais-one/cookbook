<template>
  <div class="page-flex">
    <bwc-loading-overlay v-if="loading"></bwc-loading-overlay>
    <form class="form-box-flex">
      <div v-show="mode === 'login'">
        <h1>{{ i18n.$t('sign_in') }}</h1>
        <a-input data-cy="username" label="Username" type="text" v-model:value="email"></a-input>
        <a-input data-cy="password" label="Password" type="password" v-model:value="password"></a-input>
        <div class="buttons-box-flex">
          <a-button data-cy="login" @click="login">Login</a-button>
          <a-button @click="$router.push('/signin-fast')">Mock</a-button>
        </div>
        <div class="buttons-box-flex">
          <a-button @click="loginSaml">SAML</a-button>
          <a-button @click="loginOidc">OIDC</a-button>
          <a-button @click="loginOAuth">Github</a-button>
        </div>
        <p><router-link to="/signup">Sign Up</router-link></p>
      </div>
      <div v-show="mode === 'otp'">
        <h1>Enter OTP</h1>
        <a-input data-cy="pin" label="OTP" type="text" v-model:value="otp"></a-input>
        <div class="buttons-box-flex">
          <a-button data-cy="otp" @click="otpLogin">OTP</a-button>
        </div>
      </div>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p>version {{ VERSION }} {{ isMobile ? 'Mobile' : 'Not Mobile' }}</p>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useMediaQuery } from '/src/plugins/useMediaQuery'

import parseJwt from '/@es-labs/esm/parse-jwt.js'

import { http } from '/src/services.js'
import { useI18n } from '/src/plugins/i18n.js'
import { VITE_CALLBACK_URL, VITE_SAML_URL, VITE_OIDC_URL, VITE_OAUTH_CLIENT_ID, VITE_OAUTH_URL, VITE_REFRESH_URL, VITE_REFRESH_URL_MANAGED, VERSION } from '/config.js'

export default {
  setup(props, context) {
    const store = useStore()
    const route = useRoute()

    const i18n = useI18n()
    const loading = ref(false)
    const email = ref('test')
    const password = ref('test')
    const errorMessage = ref('')
    const mode = ref('login') // login, otp
    const otp = ref('')

    let otpCount = 0
    let otpId = ''

    const isMobile = useMediaQuery('(max-width: 425px)')

    const setToLogin = () => {
      // reset email and password
      mode.value = 'login' // ui-reactive...
      otp.value = ''
      otpCount = 0 // non-ui-reactive
    }

    onUnmounted(() => console.log('signIn unmounted'))
    onMounted(async () => {
      console.log('signIn mounted!', route.hash) // deal with hashes here if necessary
      setToLogin()
      otp.value = '111111'
      errorMessage.value = ''
      loading.value = false
    })

    onBeforeUnmount(() => {
      // console.log('signIn onBeforeUnmount')
    })

    const _setUser = async (data, decoded) => {
      await store.dispatch('doLogin', decoded) // store user
      // id, groups, access_token, refresh_token
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
        if (data.otp) {
          // OTP
          mode.value = 'otp'
          otpId = data.otp
          otpCount = 0
        } else {
          // logged in
          const decoded = parseJwt(data.access_token)
          http.setTokens({ access: data.access_token, refresh: data.refresh_token })
          http.setOptions({ refreshUrl: VITE_REFRESH_URL })
          _setUser(data, decoded)
        }
      } catch (e) {
        // fetch failed
        // auth failed
        console.log('login error', e.toString(), e)
        errorMessage.value = e?.data?.message || e.toString()
      }
      loading.value = false
    }

    const otpLogin = async () => {
      if (loading.value) return
      loading.value = true
      errorMessage.value = ''
      try {
        http.setOptions({ refreshUrl: VITE_REFRESH_URL })
        const { data } = await http.post('/api/auth/otp', { id: otpId, pin: otp.value })
        // logged in
        const decoded = parseJwt(data.access_token)
        http.setTokens({ access: data.access_token, refresh: data.refresh_token })
        http.setOptions({ refreshUrl: VITE_REFRESH_URL })
        _setUser(data, decoded)
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

    const loginOidc = () => {
      http.setOptions({ refreshUrl: VITE_REFRESH_URL_MANAGED }) // auth service is managed
      window.location.assign(VITE_OIDC_URL)
    }
    const loginOAuth = () => {
      http.setOptions({ refreshUrl: VITE_REFRESH_URL })
      window.location.replace(`${VITE_OAUTH_URL}=${VITE_OAUTH_CLIENT_ID}`)
    }

    const loginSaml = () => {
      http.setOptions({ refreshUrl: VITE_REFRESH_URL })
      window.location.assign(`${VITE_SAML_URL}?RelayState=${VITE_CALLBACK_URL}`)
    }

    return {
      email, // data
      password,
      errorMessage,
      loading,
      mode,
      otp,
      login, // method
      otpLogin,
      i18n,
      VITE_CALLBACK_URL,
      VITE_SAML_URL,
      loginSaml,
      loginOidc,
      loginOAuth,
      isMobile,
      VERSION
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

.form-box-flex > div > a-input,
.form-box-flex > div > .buttons-box-flex {
  margin-top: 15px;
}

.form-box-flex > div > a-input {
  flex: 1 1 auto;
  font-size: 20px;
}

.buttons-box-flex {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.buttons-box-flex > div > a-button {
  flex: 0 1 95px;
  font-size: 20px;
}
</style>
