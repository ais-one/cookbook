import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
  },
  state: {
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    signUserUp (state, payload) { }, // DISABLED
    setUser (state, payload) { state.user = payload },
    setLoading (state, payload) { state.loading = payload },
    setError (state, payload) { state.error = payload }
  },
  getters: {
    user (state) { return state.user },
    loading (state) { return state.loading },
    error (state) { return state.error }
  },
  actions: {...actions}
})
