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
    user: null, // { id: user ID, groups: for AD groups / roles }
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
          payload.groups = decoded.groups || ''
        }
      }
      state.user = payload
      if (payload) {
        if (!HTTPONLY_TOKEN) {
          http.defaults.headers.common['access_token'] = payload.access_token
          http.defaults.headers.common['refresh_token'] = payload.refresh_token
        }
        const { access_token, refresh_token, ...noTokens } = payload
        localStorage.setItem('session', JSON.stringify(HTTPONLY_TOKEN ? noTokens : payload))
      } else {
        localStorage.removeItem('session')
        if (!HTTPONLY_TOKEN) {
          delete http.defaults.headers.common.access_token
          delete http.defaults.headers.common.refresh_token
        }
      }
    },
    setLoading (state, payload) { state.loading = payload },
    setError (state, payload) { state.error = payload },
    mutateNetworkError (state, payload) { state.networkError = payload }
  },
  // https://www.drewtown.dev/post/when-to-use-vuex-getters-in-a-vue-js-project/
  // below is not really a good way of using getters, see document above
  // Getters are a great tool but not every problem is a nail. Use them often when needing to extract parts of the state in the store or manipulate data before retrieving it.
  getters: {
    // better way to use getters...
    // getTodoById: state => id => {
    //   return state.todos.find(todo => todo.id === id);
    // }
    loading (state) { return state.loading }
  },
  actions: { ...actions }
})
