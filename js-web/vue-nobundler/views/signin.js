/*
<div ref="topRef" class="parent">
  <h1 >SignIn Page</h1>
  <input class="input" type="email" placeholder="Email" v-model="email">
  <input class="input" type="password" placeholder="Password" v-model="password">
  <button class="button is-primary is-medium is-fullwidth" @click="login">Login</button>
  <p class="test-bg"><a href="../index.html">Back To Demo</a></p>
</div>
*/
const template = /*html*/`
<section ref="topRef" class="hero is-primary is-fullheight">
  <div class="hero-body">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop is-3-widescreen">
          <form action="" class="box">
            <div style="text-align:center;display:block;">
              <img src="https://via.placeholder.com/150" />
            </div>
            <div class="field">
              <label for="" class="label">Email</label>
              <div class="control has-icons-left">
                <input type="email" placeholder="e.g. bobsmith@gmail.com" class="input" required>
                <span class="icon is-small is-left">
                  <i class="fa fa-envelope"></i>
                </span>
              </div>
            </div>
            <div class="field">
              <label for="" class="label">Password</label>
              <div class="control has-icons-left">
                <input type="password" placeholder="*******" class="input" disabled>
                <span class="icon is-small is-left">
                  <i class="fa fa-lock"></i>
                </span>
              </div>
            </div>
            <div v-if="recaptchaSiteKey" class="g-recaptcha" :data-sitekey="recaptchaSiteKey"></div>
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-success test-bg" @click.stop.prevent="login">Faked Login</button>
              </div>
              <div class="control">
                <button class="button is-success" @click.stop.prevent="oauthLogin">Faked OAuth</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
`

const styles = /*html*/`
.test-bg {
  background-color: darkblue !important;
}
`

const { onMounted, ref } = Vue
const { useStore } = Vuex
const { useRouter } = VueRouter

export default {
  template,
  setup() {
    const email = ref('1111')
    const password = ref('1111')
    const store = useStore()
    const router = useRouter()

    const topRef = ref(null)
    const recaptchaSiteKey = ref('6LcjlzkUAAAAAOwP26tCRCivcYyAu3hQ7AlMPLh3')

    onMounted(async () => {
      // console.log(topRef)
      // TBD loading spinner...
      console.log('SignIn mounted!')
      if (window.location.hash) {
        alert('Test OAuth callback Success! Remember to remove hash from front of token', window.location.hash) // token-refresh_token, - character is seperator
      }

      // set google recaptcha callbacks
      // https://www.google.com/recaptcha/about/
      const recaptchaEl = document.querySelector('.g-recaptcha')
      if (recaptchaEl) {
        window.onRecaptchaSuccess = (token) => console.log('recaptcha token', token) // use this to enable button
        window.onRecaptchaExpired = () => console.log('recaptcha expired')
        window.onRecaptchaError = (e) => console.log('recaptcha error', e)
        recaptchaEl.setAttribute('data-callback', 'onRecaptchaSuccess')
        recaptchaEl.setAttribute('data-expired-callback', 'onRecaptchaExpired')
        recaptchaEl.setAttribute('data-error-callback', 'onRecaptchaError')  
      }

      // thank you Arjay for this! https://plnkr.co/edit/tjhkcfNO15aTNhsU
      const style = document.createElement('style')
      style.innerHTML = styles
      topRef.value.prepend(style)
    })

    const login = () => {
      store.commit('setUser', email.value)
      router.push('/dashboard')
    }

    const oauthLogin = () => {
      const url = window.location.href + '/index.html#sometoken'
      window.location.replace(url)
    }

    return {
      topRef,
      email,
      password,
      recaptchaSiteKey,
      login,
      oauthLogin
    }
  }
}
