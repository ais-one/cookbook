import Vue from 'vue'
import Vuex from 'vuex'
import jwtDecode from 'jwt-decode'
import actions from './actions'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
  },
  state: {
    layout: 'layout-default',
    user: null, // token, verified, (id - maybe to remove) // localStorage.getItem('user-token') || null
    loading: false,
    error: null,
    networkError: false
  },
  mutations: {
    signUserUp (state, payload) { }, // DISABLED
    setLayout (state, payload) { state.layout = payload },
    setUser (state, payload) {
      if (payload && payload.token) {
        const decoded = jwtDecode(payload.token)
        if (decoded) {
          payload.id = decoded.id
          payload.clientId = decoded.clientId
        }
      }
      state.user = payload
    },
    setLoading (state, payload) { state.loading = payload },
    setError (state, payload) { state.error = payload },
    mutateNetworkError (state, payload) { state.networkError = payload }
  },
  getters: {
    layout (state) { return state.layout },
    user (state) { return state.user },
    loading (state) { return state.loading },
    error (state) { return state.error },
    networkError (state) { return state.networkError }
  },
  actions: { ...actions }
})
