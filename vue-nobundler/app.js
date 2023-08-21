import Secure from './layouts/secure.js'
import Public from './layouts/public.js'
import { statex } from './store.js'

const { onMounted, computed } = Vue

export default {
  components: {
    'ms-secure': Secure,
    'ms-public': Public
  },
  template: /*html*/`
    <div>
      <!-- h1>App<a href="/index.html">Back To Express Demo</a></h1 -->
      <ms-public v-if="!statex.user" />
      <ms-secure v-else />
    </div>
  `,
  setup() {
    const storeUser = computed(() => statex.user) // NOT NEEDED ?

    onMounted(async () => {
      console.log('App mounted!', statex.user)
    })

    return {
      statex,
      storeUser
    }
  }
}
