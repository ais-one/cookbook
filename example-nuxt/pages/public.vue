<template>
  <div>
    <v-alert :value="true" type="success">You should see this page without need to authentication!</v-alert>
    Test: [{{ vv }}]
    <v-btn @click="test">TEST</v-btn>
  </div>
</template>

<script>
import _cloneDeep from 'lodash.clonedeep'

const XrudStore = {
  namespaced: true,
  state: {
    count: 0
  },
  getters: {
    getCount: state => state.count
  },
  actions: {
    increment: ({ commit }) => commit('increment')
  },
  mutations: {
    increment(state) {
      state.count++
    }
  }
}

export default {
  middleware: ['auth'],
  options: {
    auth: false
  },
  data: () => ({
    vv: 'NA'
  }),
  computed: {
    xxx() {
      return this.$store.getters['blah/getCount']
    }
  },
  created() {
    const name = 'blah'
    const store = this.$store
    // register a new module only if doesn't exist
    if (!(store && store.state && store.state[name])) {
      console.log('aaa')
      store.registerModule(name, _cloneDeep(XrudStore)) // make sure its a deep clone
    }
  },
  mounted() {
    // const name = 'blah'
    // const store = this.$store
    // // register a new module only if doesn't exist
    // if (!(store && store.state && store.state[name])) {
    //   console.log('aaa')
    //   store.registerModule(name, _cloneDeep(XrudStore)) // make sure its a deep clone
    // }
    // this.ready = true
  },
  methods: {
    test() {
      console.log('test', this.$store)
      this.vv = this.xxx ? this.xxx : 'dd' // this.$store.getters['blah/getCount']
      console.log('test2', this.vv)
      this.$store.dispatch('blah/increment')
    }
  }
}
</script>
