// import * as firebase from 'firebase'
import { auth } from '@/firebase'
import router from '../router'

export default {
  async signUserUp ({ commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let user = null
    try {
      user = await auth.createUserWithEmailAndPassword(payload.email, payload.password)
    } catch (e) { }
    commit('setLoading', false)
    if (user) {
      const newUser = { id: user.uid, email: payload.email }
      commit('setUser', newUser)
    } else {
      commit('setError', { message: 'Error Signup' })
      /* TBD
        if (error.code === 'auth/email-already-in-use') {
          var credential = auth.EmailAuthProvider.credential(payload.email, payload.password)
          user = await auth.currentUser.linkWithCredential(credential)
          if (user) {
            const newUser = {id: user.uid}
            commit('setUser', newUser)
          }
        }
      */
    }
  },
  async signUserIn ({ dispatch, commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let user = null
    try {
      user = await auth.signInWithEmailAndPassword(payload.email, payload.password)
      // console.log('signUserIn', user)
      // dispatch('autoSignIn', user) // no need this for firebase auth due to auth listener
    } catch (e) { }
    if (!user) {
      commit('setError', { message: 'Sign In Error' })
    }
    commit('setLoading', false)
  },
  async logout ({ commit }, payload) {
    const { userLogout } = payload
    if (userLogout) {
      await auth.signOut()
    }
    commit('setUser', null)
    commit('setLayout', 'layout-default')
    router.push('/')
  },
  autoSignIn ({ commit }, payload) {
    commit('setUser', { id: payload.uid, email: payload.email, rules: { '*': ['*'] } })
    commit('setLayout', 'layout-admin')
    router.push('/multi-crud-example') // console.log party
  },
  clearError ({ commit }) { commit('setError', null) }
}
