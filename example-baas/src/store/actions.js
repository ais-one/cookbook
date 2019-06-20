import { auth } from '@/firebase'
import { stitch, getUserPasswordCredential } from '@/mongo'
import router from '../router'

export default {
  // mongo
  async mongoSignin ({ commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let auth = null
    try {
      const credential = getUserPasswordCredential(payload.email, payload.password)
      auth = await stitch.auth.loginWithCredential(credential)
      // console.log('mongoSignin', auth)
    } catch (e) { }
    commit('setLoading', false)
    if (!auth) {
      commit('setError', { message: 'Mongo Sign In Error' })
    } else {
      commit('setUser', { id: auth.id, email: auth.id, rules: { '*': ['*'] } })
      commit('setLayout', 'layout-admin')
      router.push('/mongo-test')
    }
  },
  mongoAutoSignIn ({ commit }, payload) { // not called for now
    commit('setUser', { id: payload.id, email: payload.id, rules: { '*': ['*'] } })
    commit('setLayout', 'layout-admin')
    router.push('/mongo-test')
  },
  // firebase
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
  autoSignIn ({ commit }, payload) {
    commit('setUser', { id: payload.uid, email: payload.email, rules: { '*': ['*'] } })
    commit('setLayout', 'layout-admin')
    router.push('/multi-crud-example') // console.log party
  },
  // common
  async logout ({ commit }, payload) {
    const { userLogout } = payload
    if (userLogout) { // logout both mongo & firebase
      await auth.signOut()
      await stitch.auth.logout()
    }
    commit('setUser', null)
    commit('setLayout', 'layout-default')
    router.push('/')
  },
  clearError ({ commit }) { commit('setError', null) }
}
