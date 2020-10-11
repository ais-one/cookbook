import Secure from './layouts/secure.js'
import Public from './layouts/public.js'

const { onMounted, computed } = Vue
const { useStore } = Vuex

export default {
  components: {
    'ms-secure': Secure,
    'ms-public': Public
  },
  template: /*html*/`
    <div>
      <h1>App</h1><a href="/index.html">Back To Express Demo</a>
      <ms-public v-if="!storeUser" />
      <ms-secure v-else />
    </div>
  `,
  setup() {
    const store = useStore()
    const storeUser = computed(() => store.state.user)

    onMounted(async () => {
      console.log('App mounted!', store.state.user)
    })

    return {
      storeUser
    }
  }
}
