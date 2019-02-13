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
    count: null
    // count: { counter: 0 }
  },
  getters: {
    getCount: state => state.count.counter
  },
  actions: {
    increment: ({ commit }) => commit('increment')
  },
  mutations: {
    increment(state) {
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
      console.log('a1', this.$store._actions, this.$store._modulesNamespaceMap)
      this.$store.registerModule(name, _cloneDeep(XrudStore)) // make sure its a deep clone
      this.$store.commit(`blah/setCounter`, { counter: 0 })
      console.log('a2', this.$store._actions, this.$store._modulesNamespaceMap)
    }
  },
  mounted() {
    const name = 'blah'
    const store = this.$store
    // register a new module only if doesn't exist
    // if (!(store && store.state && store.state[name])) {
    if (!this.$store._modulesNamespaceMap[name + '/'] || !store.state[name]) {
      store.registerModule(name, _cloneDeep(XrudStore)) // make sure its a deep clone
      this.$store.commit(`blah/setCounter`, { counter: 0 })
    }
  },
  methods: {
    test() {
      console.log('test', this.$store, this.$store._actions)
      this.vv = this.xxx ? this.xxx : 'dd' // this.$store[name].getters['blah/getCount']
      console.log('test2', this.vv)
      this.$store.dispatch('blah/increment')
    }
  }
}
</script>
