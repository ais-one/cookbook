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

            <div class="field">
              <div class="control">
              <label for="" class="label">Test Autocomplete</label>
              <bwc-autocomplete required :items="ac.items" v-model="ac.val" @search="(e) => autoComplete(e)"></bwc-autocomplete>
              </div>
            </div>

            <div class="field is-grouped">
              <div class="control">
                <button class="button is-success" disabled>Login</button>
              </div>
              <div class="control">
                <button class="button is-success test-bg" @click.stop.prevent="login">SSO Login</button>
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

const { onMounted, ref, reactive } = Vue
const { useStore } = Vuex
const { useRouter } = VueRouter

export default {
  template,
  setup() {
    const email = ref('1111')
    const password = ref('1111')
    const store = useStore()
    const router = useRouter()
    const ac = reactive({
      val: 'a',
      items: 'aa9,aa5'
    })

    const topRef = ref(null)

    onMounted(async () => {
      // console.log(topRef)
      console.log('SignIn mounted!')
      // thank you Arjay for this! https://plnkr.co/edit/tjhkcfNO15aTNhsU
      const style = document.createElement('style')
      style.innerHTML = styles
      topRef.value.prepend(style)
    })

    const login = () => {
      store.commit('setUser', email.value)
      router.push('/dashboard')
    }

    const autoComplete = (e) => {
      const result = []
      for (let i = 0; i < e.detail.length + 10; i++) result.push('aa' + i)
      ac.items = result.join(',')
    }

    return {
      topRef,
      email,
      password,
      login,
      ac,
      autoComplete
    }
  }
}
