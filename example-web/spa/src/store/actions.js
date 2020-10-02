import { http } from '@/axios'
import router from '../router'

const USE_OTP = false

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
  async signUserIn ({ dispatch, commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let rv = null
    const { email, password } = payload
    try {
      rv = await http.post('/api/auth/login', { email, password })
      const { data } = rv
      await dispatch('autoSignIn', data) // token
      if (data.verified) {
        await router.push('/dashboard')
      }
    } catch (e) { }
    if (!rv) {
      commit('setError', { message: 'Sign In Error' })
    }
    commit('setLoading', false)
  },
  async verifyOtp ({ dispatch, commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let rv = null
    const { pin } = payload
    try {
      rv = await http.post('/api/auth/otp', { pin })
      const { data } = rv
      await dispatch('autoVerify', data) // token
      await router.push('/dashboard')
    } catch (e) {
      console.log('Currently Nothing To Handle Failures e.g. back to login / retries', e)
    }
    if (!rv) {
      commit('setError', { message: 'Verify Error' })
    }
    commit('setLoading', false)
  },

  // TBD fix broken promises here... actions return a promise...
  // layout-secure, layout-public, setSecure payload is route instead of layout name..., setPublic
  autoSignIn ({ commit }, payload) { // payload.token only
    commit('setUser', payload)
    if (payload.verified) {
      commit('setLayout', 'layout-admin')
    }
  },

  async autoVerify ({ commit }, payload) { // payload.token only
    commit('setUser', payload)
    commit('setLayout', 'layout-admin')
  },
  clearError ({ commit }) { commit('setError', null) },

  setNetworkError ({ commit }, payload) { commit('mutateNetworkError', payload) },

  // Common Logout
  async logout ({ commit }, payload) {
    commit('setLoading', true)
    console.log('logging out', payload)
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
