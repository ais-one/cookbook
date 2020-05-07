import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.esm.browser.min.js'
import Vuex from 'https://cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.esm.browser.min.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    token: null
  },
  getters: {
    user (state) { return state.user },
    token (state) { return state.token }
  },
  mutations: {
    setUser (state, payload) { state.user = payload },
    setToken (state, payload) { state.token = payload }
  },
  actions: {
  }
})
