<template>
  <div>
    <v-alert :value="true" type="success">You should see this page without need to authenticate!</v-alert>
    Test: [{{ countVal }}]
    <v-btn @click="test">TEST</v-btn>
  </div>
</template>

<script>
import _cloneDeep from 'lodash.clonedeep'

const DemoStore = {
  namespaced: true,
  state: {
    count: { counter: 0 }
  },
  getters: {
    getCount: state => state.count
  },
  actions: {
    increment: ({ commit }) => commit('increment')
  },
  mutations: {
    increment(state) {
      console.log('increment')
      state.count.counter++
    },
    setCounter(state, payload) {
      state.count = payload
    }
  }
}

export default {
  middleware: ['auth'],
  options: {
    auth: false
  },
  data: () => ({
    countVal: 'NA'
  }),
  computed: {
    computedCount() {
      return this.$store.getters['blah/getCount']
    }
  },
  created() {
    if (process.client) {
      console.log('public.vue created() client')
      const name = 'blah'
      // register a new module only if doesn't exist
      if (!(this.$store && this.$store.state && this.$store.state[name])) {
        console.log('Dynamic Vuex module created...')
        this.$store.registerModule(name, _cloneDeep(DemoStore)) // { preserveState: true } has no effect
        // TEST START - Uncomment code so that no error occurs
        // this.$store.state[name] = {} // required for nuxt
        // this.$store.commit(`blah/setCounter`, { counter: 0 }) // required for nuxt generated...
        // TEST EMD
        console.log('Vuex store state', this.$store.state)
      }
      // window.addEventListener('click', e => alert('clicked')) // Cannot Generate! Direct Call Will Fail
    } else {
      console.log('public.vue created() server')
      const generateError = true
      if (generateError) {
        window.addEventListener('click', e => alert('clicked')) // Cannot Generate! Direct Call Will Fail
      }
    }
  },
  mounted() {
    if (process.client) {
      console.log('public.vue mounted() client')
    } else {
      console.log('public.vue mounted() server')
    }
  },
  methods: {
    test() {
      this.$store.dispatch('blah/increment')
      const counter = this.computedCount.counter
      this.countVal = counter ? counter : 'No Count Yet'
    }
  }
}
</script>
