const template = /*html*/`
<div ref="topRef">
  <h1 >SignIn Page</h1>
  <input class="input" type="email" placeholder="Email" v-model="email">
  <input class="input" type="password" placeholder="Password" v-model="password">
  <button class="button is-primary is-medium is-fullwidth" @click="login">Login</button>
  <p class="test-bg"><a href="../index.html">Back To Demo</a></p>
</div>
`

const styles = /*html*/`
.test-bg {
  background-color: pink;
}
#app {
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

    onMounted(async () => {
      console.log(topRef)
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

    return {
      topRef,
      email,
      password,
      login
    }
  }
}
