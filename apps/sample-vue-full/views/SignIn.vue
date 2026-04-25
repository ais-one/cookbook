<template>
  <div class="page-flex">
    <form class="form-box-flex">
      <div v-show="mode === 'login'">
        <h1>{{ i18n.$t('sign_in') }}</h1>
        <a-input data-cy="username" label="Username" type="text" v-model:value="email"></a-input>
        <a-input data-cy="password" label="Password" type="password" v-model:value="password"></a-input>
        <a-checkbox v-model:checked="forced">Force Login</a-checkbox>
        <div class="buttons-box-flex"><a-button data-cy="login" @click="login">Login</a-button></div>
        <div class="buttons-box-flex"><a-button @click="oauthLogin">OAuth</a-button></div>
        <p><router-link to="/signup">Sign Up</router-link></p>
      </div>
      <div v-show="mode === 'otp'">
        <h1>Enter OTP</h1>
        <a-input data-cy="pin" label="OTP" type="text" v-model:value="otp"></a-input>
        <div class="buttons-box-flex"><a-button data-cy="otp" @click="otpLogin">OTP</a-button></div>
      </div>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p>{{ isMobile ? 'Mobile' : 'Not Mobile' }}</p>
    </form>
  </div>
</template>

<script setup>
import { http } from '@common/vue/plugins/fetch.js';
import { useI18n } from '@common/vue/plugins/i18n.js';
import { onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMediaQuery } from '../../../common/plugins/useMediaQuery.js';
import parseJwt from '../../../common/vanilla/web/parse-jwt.js';
import { useMainStore } from '../store.js';

const { VITE_REFRESH_URL, MODE } = import.meta.env;
const store = useMainStore();
const route = useRoute();
const i18n = useI18n();
const loading = store.loading;
const email = ref('test');
const password = ref('test');
const errorMessage = ref('');
const mode = ref('login'); // login, otp
const otp = ref('');

const forced = ref(false);
let otpCount = 0;
let otpId = '';

const isMobile = useMediaQuery('(max-width: 425px)');

const setToLogin = () => {
  // reset email and password
  mode.value = 'login'; // ui-reactive...
  otp.value = '';
  otpCount = 0; // non-ui-reactive
};

onUnmounted(() => console.log('signIn unmounted'));

onMounted(async () => {
  console.log('signIn mounted!', route.hash); // deal with hashes here if necessary
  setToLogin();
  otp.value = '111111';
  errorMessage.value = '';
  store.loading = false;
});

onBeforeUnmount(() => {
  // console.log('signIn onBeforeUnmount')
});

const _setUser = async (data, user) => {
  // store user
  await store.doLogin(user);
  // id, roles, access_token, refresh_token
};

const login = async () => {
  console.log('login clicked', forced.value);
  if (forced.value) {
    _setUser(null, {
      id: 1,
      access_token: '',
      refresh_token: '',
    });
    return;
  }
  if (store.value) return;
  store.loading = true;
  errorMessage.value = '';
  try {
    const { data } = await http.post('/api/auth/login', {
      email: email.value,
      password: password.value,
    });
    if (data.otp) {
      // OTP
      mode.value = 'otp';
      otpId = data.otp;
      otpCount = 0;
    } else {
      // logged in
      const user = parseJwt(data.access_token);
      http.setTokens({ access: data.access_token, refresh: data.refresh_token });
      http.setOptions({ refreshUrl: VITE_REFRESH_URL });
      _setUser(data, user);
    }
  } catch (e) {
    // fetch failed
    // auth failed
    console.log('login error', e.toString(), e);
    errorMessage.value = e?.data?.message || e.toString();
  }
  store.loading = false;
};

const otpLogin = async () => {
  if (store.loading) return;
  store.loading = true;
  errorMessage.value = '';
  try {
    http.setOptions({ refreshUrl: VITE_REFRESH_URL });
    const { data } = await http.post('/api/auth/otp', { id: otpId, pin: otp.value });
    // logged in
    const user = parseJwt(data.access_token);
    http.setTokens({ access: data.access_token, refresh: data.refresh_token });
    http.setOptions({ refreshUrl: VITE_REFRESH_URL });
    _setUser(data, user);
  } catch (e) {
    if (e.data.message === 'Token Expired Error') {
      errorMessage.value = 'OTP Expired';
      setToLogin();
    } else if (otpCount < 3) {
      otpCount++;
      errorMessage.value = 'OTP Error';
    } else {
      errorMessage.value = 'OTP Tries Exceeded';
      setToLogin();
    }
  }
  store.loading = false;
};

const oauthLogin = () => {
  alert('Please set appropriate callback URL at oauth side');
  if (MODE === 'mocked') {
    window.location.assign('/callback#mocked');
  } else {
    const OAUTH_URL = 'https://github.com/login/oauth/authorize?scope=user:email&client_id';
    const OAUTH_CLIENT_ID = 'a355948a635c2a2066e2';
    http.setOptions({ refreshUrl: VITE_REFRESH_URL });
    window.location.replace(`${OAUTH_URL}=${OAUTH_CLIENT_ID}`);
  }
};
</script>

<style scoped>
@import '../style/signin.css';
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

.buttons-box-flex {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.buttons-box-flex > div > a-button {
  flex: 0 1 95px;
  font-size: 20px;
}

.form-box-flex > div > a-input,
.form-box-flex > div > .buttons-box-flex {
  margin-top: 15px;
}

.form-box-flex > div > a-input {
  flex: 1 1 auto;
  font-size: 20px;
}
</style>
