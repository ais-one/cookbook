import { stitch, getUserPasswordCredential } from '@/mongo'
import router from '../router'

export default {
  // async signUserUp ({ commit }, payload) {
  //   commit('setLoading', true)
  //   commit('setError', null)
  //   let user = null
  //   try {
  //     // const emailPassClient = stitch.auth.getProviderClient(UserPasswordAuthProviderClient.factory)
  //     // await emailPassClient.registerWithEmail(authData.email, authData.password)
  //     user = await auth.createUserWithEmailAndPassword(payload.email, payload.password)
  //   } catch (e) { }
  //   commit('setLoading', false)
  //   if (user) {
  //     const newUser = { id: user.id, email: payload.email }
  //     commit('setUser', newUser)
  //   } else {
  //     commit('setError', { message: 'Error Signup' })
  //   }
  // },
  async signUserIn ({ dispatch, commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let auth = null
    try {
      const credential = getUserPasswordCredential(payload.email, payload.password)
      let auth = await stitch.auth.loginWithCredential(credential)
      console.log('signUserIn', auth)
      // dispatch('autoSignIn', user) // no need this for firebase auth due to auth listener
    } catch (e) { }
    if (!auth) {
      commit('setError', { message: 'Sign In Error' })
    }
    commit('setLoading', false)
  },
  async logout ({ commit }, payload) {
    const { userLogout } = payload
    if (userLogout) {
      await stitch.auth.logout()
    }
    commit('setUser', null)
    commit('setLayout', 'layout-default')
    router.push('/')
  },
  autoSignIn ({ commit }, payload) {
    commit('setUser', { id: payload.id, email: payload.id, rules: { '*': ['*'] } })
    commit('setLayout', 'layout-admin')
    router.push('/multi-crud-example') // console.log party
  },
  clearError ({ commit }) { commit('setError', null) }
}
