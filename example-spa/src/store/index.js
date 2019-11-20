import Vue from 'vue'
import Vuex from 'vuex'
import jwtDecode from 'jwt-decode'
import actions from '@/store/actions'
import { http } from '@/axios'
import { HTTPONLY_TOKEN } from '@/config'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
  },
  state: {
    layout: 'layout-default',
    user: null,
    loading: false,
    error: null,
    networkError: false
  },
  mutations: {
    signUserUp (state, payload) { }, // DISABLED
    setLayout (state, payload) { state.layout = payload },
    // setPublic (state, payload) { state.layout = 'layout-public' }, // also do router push
    // setSecure (state, payload) { state.layout = 'layout-secure' }, // also do router push
    setUser (state, payload) {
      if (payload && payload.token) {
        const decoded = jwtDecode(payload.token)
        if (decoded) {
          payload.id = decoded.id
          payload.verified = decoded.verified
        }
        payload.loginType = 'rest'
      }
      state.user = payload
      if (payload) {
        if (!HTTPONLY_TOKEN) http.defaults.headers.common['Authorization'] = 'Bearer ' + payload.token
        const { token, refresh_token, ...noTokens } = payload
        localStorage.setItem('session', JSON.stringify(HTTPONLY_TOKEN ? noTokens : payload))
      } else {
        localStorage.removeItem('session')
        if (!HTTPONLY_TOKEN) delete http.defaults.headers.common['Authorization']
      }
    },
    setBaasUser (state, payload) {
      console.log('setBaasUser', payload)
      state.user = payload
    }, // for BAAS like firebase, mongo stitch
    setLoading (state, payload) { state.loading = payload },
    setError (state, payload) { state.error = payload },
    mutateNetworkError (state, payload) { state.networkError = payload }
  },
  // https://www.drewtown.dev/post/when-to-use-vuex-getters-in-a-vue-js-project/
  // below is not really a good way of using getters, see document above
  getters: {
    // better way to use getters...
    // getTodoById: state => id => {
    //   return state.todos.find(todo => todo.id === id);
    // }
    loading (state) { return state.loading }
  },
  actions: { ...actions }
})
