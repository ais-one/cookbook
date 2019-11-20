// we had to do this as we are still mutating states directly, may need to fix this...
// https://github.com/nuxt/nuxt.js/issues/1917
// TBD!
export const strict = false

import { HTTPONLY_TOKEN } from '@/config'
import { http } from '@/plugins/axios'
import jwtDecode from 'jwt-decode'

// Problem in VueCrudX is this... (there could be more)
// store.state[name].defaultRec = this.crudForm.defaultRec
// store.state[name].filters = this.crudFilter.filters
// store.state[name].crudOps = this.crudOps

export const modules = {}

export const state = () => ({
  user: null
})

export const mutations = {
  setUser (state, payload) {
    // console.log('setUser', http, $nuxt)
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
  }
}

export const actions = {
  async logout ({ commit }, payload) {
    // commit('setLoading', true)
    console.log('logging out', payload)
    console.log('LOGOUT Rest')
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
      // if (payload.forced) commit('setError', { message: 'Session Expired' })
    }
    $nuxt.$router.push('/')
    commit('setUser', null)
    // commit('setLayout', 'layout-default')
    // commit('setLoading', false)
  }
}