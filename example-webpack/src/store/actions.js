import { http } from '@/axios'
import router from '../router'

export default {
  async signUserUp ({ commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let rv = null
    const { email, password } = payload
    try {
      rv = await http.post('/api/auth/signup', { email, password })
    } catch (e) { }
    commit('setLoading', false)
    if (rv) {
      const newUser = { id: payload.id, email: payload.email }
      commit('setUser', newUser)
      commit('setError', { message: 'User Registered' })
    } else {
      commit('setError', { message: 'Error Signup' })
    }
  },
  clearError ({ commit }) { commit('setError', null) },

  setNetworkError ({ commit }, payload) { commit('mutateNetworkError', payload) },

  // Common Logout
  async logout ({ commit }, payload) {
    commit('setLoading', true)
    // console.log('logging out', payload)
    if (payload.forced) { // auth failure detected
    } else { // logout button clicked
      try {
        await http.get('/api/auth/logout')
      } catch (e) {
        if (!e.response || e.response.status === 401) { // server or authorization error
          // ok please continue
        } else {
          return // may have problems here... loading still true, etc...
        }
      }
    }
    if (payload.forced) commit('setError', { message: 'Session Expired' })
    if (router.app.$route.path !== '/') router.push('/')
    commit('setUser', null)
    commit('setLayout', 'layout-default')
    commit('setLoading', false)
  }
}

/*
function doSomething() {
  console.log("10 seconds");
  setTimeout(doSomething, 10000)
}
setTimeout(doSomething, 10000)
*/
