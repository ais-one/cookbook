<template>
  <div class="page-flex">
    <vcxwc-loading-overlay v-if="loading"></vcxwc-loading-overlay>
    <form class="form-box-flex">
      <div v-show="mode==='login'">
        <h1>{{ i18n.$t('sign_in') }}</h1>
        <mwc-textfield label="Username" outlined type="text" v-model="email"></mwc-textfield>
        <mwc-textfield label="Password" outlined type="password" v-model="password"></mwc-textfield>
        <div class="buttons-box-flex">
          <mwc-button raised label="Login" type="button" @click="login"></mwc-button>
        </div>
        <p><router-link to="/signup">Sign Up</router-link></p>
      </div>
      <div v-show="mode==='otp'">
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import { useXhr } from '/src/plugins/xhr.js'
import { useI18n } from '/src/plugins/i18n.js'
import { useWs } from '/src/plugins/ws.js'


export default {
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const http = useXhr()
    const i18n = useI18n()
    const ws = useWs()

    const loading = ref(false)
    const email = ref('test')
    const password = ref('test')
    const errorMessage = ref('')
    const mode = ref('login') // login, otp
    const otp = ref('')

    let otpCount = 0

    let timerId = null

    const setToLogin = () => {
      mode.value = 'login'
      otp.value = ''
      otpCount = 0
    }

    onMounted(async () => {
      setToLogin()
      errorMessage.value = ''
      loading.value = false
      // email
      // password

      if (ws) ws.onmessage = e => console.log('ws onmessage', e, e.data)

      timerId = setInterval(async () => {
        if (ws) {
          console.log('ws interval', ws)
          ws.send('Hello ' + new Date())
          // if (navigator.onLine) this.updateNetworkError(false)
          // else this.updateNetworkError(true)
        } else {
          console.log('ws falsy')
        }
      }, 10000)
    })

    onBeforeUnmount(() => {
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      }
      if (ws) ws.onmessage = null
    })

    const _setUser = async (data, decoded) => {
      await store.dispatch('doLogin', decoded) // store user
      await router.push('/dashboard')
      // id, verified, groups, token, refresh_token
    }

    const login = async () => {
      if (loading.value) return
      loading.value = true
      errorMessage.value = ''
      try {
        const { data } = await http.post('/api/auth/login', { email: email.value, password: password.value })
        const decoded = http.parseJwt(data.token)
        http.setToken(data.token)
        http.setRefreshToken(data.refresh_token)
        if (decoded.verified) {
          _setUser(data, decoded)
        } else { // OTP
          mode.value = 'otp'
          otpCount = 0
        }
      } catch (e) {
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
        const decoded = http.parseJwt(data.token)
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
      email, // data
      password,
      errorMessage,
      loading,
      mode,
      otp,
      login, // method
      otpLogin,
      i18n
    }
  }
}
</script>

<style scoped>
.page-flex h1, .page-flex p {
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

.form-box-flex > div > mwc-textfield, .form-box-flex > div > .buttons-box-flex {
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
