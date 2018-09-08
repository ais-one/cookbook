import {http} from '@/axios'
import router from '../router'

export default {
  async signUserUp ({commit}, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let rv = null
    const {email, password} = payload
    try {
      rv = await http.post('/signup', {
        email,
        password
      })
    } catch (e) { }
    commit('setLoading', false)
    if (rv) {
      // const newUser = {id: user.uid, email: payload.email}
      // commit('setUser', newUser)
      commit('setError', {message: 'uUser Registered'})
    } else {
      commit('setError', {message: 'Error Signup'})
    }
  },
  async signUserIn ({dispatch, commit}, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let rv = null
    const {email, password} = payload
    try {
      rv = await http.post('/login', {
        email,
        password
      })
      rv.data.rules = { '*': '*' }
      dispatch('autoSignIn', rv.data) // token
    } catch (e) { }
    if (!rv) {
      commit('setError', {message: 'Sign In Error'})
    }
    commit('setLoading', false)
  },
  async logout ({commit}, payload) {
    commit('setLoading', true)
    try {
      await http.get('/logout', { headers: { token: payload.user.token } })
    } catch (e) { }
    commit('setUser', null)
    commit('setLayout', 'layout-default')
    router.push('/')
    commit('setLoading', false)
  },
  autoSignIn ({commit}, payload) {
    commit('setUser', payload)
    commit('setLayout', 'layout-admin')
    router.push('/user')
  },
  clearError ({commit}) { commit('setError', null) }
}
