const template = /*html*/`
<section>
  <div class="container">
    <h1 class="title">WebAuthn SPA Sample</h1>
    <div class="control">
      <label class="radio"><input type="radio" v-model="mode" value="register" checked>Register</label>
      <label class="radio"><input type="radio" v-model="mode" value="signin">SignIn</label>
    </div>
    <h2>Credentials {{ credId }}</h2>
    <h2>Logged In {{ loggedIn }}</h2>
  </div>
  <div class="container" v-if="mode==='register'">
    <h2 class="subtitle">Register new user</h2>
    <div class="field">
      <label class="label">Username</label>
      <div class="control"><input class="input" type="text" v-model="username" required /></div>
    </div>
    <div class="field">
      <label class="label">Password</label>
      <div class="control"><input class="input" type="password" v-model="password" required /></div>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button class="button" @click="register">Register</button>
      </div>
      <div class="control">
        <button class="button" @click="getCredentials">Get Credentials</button>
      </div>
      <div class="control">
        <button class="button" @click="clear">Test Clear Credentials</button>
      </div>
      <div class="control">
        <button class="button is-link is-light">Cancel</button>
      </div>
    </div>
  </div>
  <div class="container" v-else>
    <h2 class="subtitle">Login with a username/password or username/fido2</h2>
    <div class="field">
      <label class="label">Username</label>
      <div class="control"><input class="input" type="text" v-model="username" required /></div>
    </div>
    <div class="field">
      <label class="label">Password (if blank use Fido2)</label>
      <div class="control"><input class="input" type="password" v-model="password" /></div>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button class="button" @click="login">Login</button>
      </div>
    </div>
  </div>
</section>
`

import { _fetch, setToken, registerCredential, unregisterCredential, authenticate } from './client-spa.js';

/*
const form = document.querySelector('#form');
form.addEventListener('submit', e => {
  e.preventDefault()
  const form = new FormData(e.target)
  const cred = {}
  form.forEach((v, k) => cred[k] = v)
  _fetch(e.target.action, cred).then(user => location.href = '/reauth').catch(e => alert(e))
})

    <form id="form" method="POST" action="/webauthn/username" >
      <label id="username-label">username</label>
      <input type="text" aria-labelledby="username-label" name="username" />
      <input type="submit" value="Next" />
    </form>

*/

export default {
  name: 'App',

  setup() {
    const { onMounted, ref } = Vue
    const mode = ref('register') //  register / login
    const username = ref('')
    const password = ref('')
    const credId = ref('') // credentials id
    const loggedIn = ref(false)

    //store management: save $variables to localstorage
    onMounted(() => {
      if (window.location.hash) {
        // verify incoming token, if ok redirect to private page
      }
    })

    const getCredentials = async () => {
      try {
        const res = await _fetch('/webauthn-spa/get-keys')
        return res?.credentials[0]?.credId
      } catch (e) {
        console.log('getCredentials', e.toString())
      }
      return null
    }

    const register = async () => {
      try {
        await _fetch('/webauthn-spa/spa-register', { username: username.value, password: password.value })
        setToken(username.value)
        registerCredential().then(async (user) => {
          credId.value = await getCredentials()
        }).catch(e => alert(e))
      } catch (e) {
        console.log('register', e.toString())
      }
    }

    const clear = async () => {
      try {
        await unregisterCredential(credId.value)
        credId.value = await getCredentials()
      } catch (e) {
        console.log('clear', e.toString())
      }
    }

    const login = async () => {
      try {
        if (!password.value) {
          const rv = await authenticate(credId.value)
          console.log('webauthn', rv)
          loggedIn.value = true
        } else {
          const rv = await _fetch('/webauthn-spa/spa-login', { username: username.value, password: password.value })
          loggedIn.value = true
          console.log('password', rv)
        }
      } catch (e) {
        console.log('login', e.toString())
      }
    }

    return {
      credId,
      loggedIn,
      mode,
      username,
      password,
      getCredentials,
      register,
      clear,
      login
    }
  },

  template
};