import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
  },
  state: {
    layout: 'layout-default',
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setLayout (state, payload) { state.layout = payload },
    signUserUp (state, payload) { }, // DISABLED
    setUser (state, payload) { state.user = payload },
    setLoading (state, payload) { state.loading = payload },
    setError (state, payload) { state.error = payload }
  },
  getters: {
    layout (state) { return state.layout },
    user (state) { return state.user },
    loading (state) { return state.loading },
    error (state) { return state.error }
  },
  actions: {...actions}
})
