// we had to do this as we are still mutating states directly, may need to fix this...
// https://github.com/nuxt/nuxt.js/issues/1917
// TBD!
export const strict = false

import { HTTPONLY_TOKEN } from '@/config'

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
    if (payload && payload.token) {
      const decoded = jwtDecode(payload.token)
      if (decoded) {
        payload.id = decoded.id
        payload.verified = decoded.verified
      }
      // payload.loginType = 'rest'
    }
    state.user = payload
    // if (payload) {
    //   if (!HTTPONLY_TOKEN) http.defaults.headers.common['Authorization'] = 'Bearer ' + payload.token
    //   const { token, refresh_token, ...noTokens } = payload
    //   localStorage.setItem('session', JSON.stringify(HTTPONLY_TOKEN ? noTokens : payload))
    // } else {
    //   localStorage.removeItem('session')
    //   if (!HTTPONLY_TOKEN) delete http.defaults.headers.common['Authorization']
    // }
  }
}