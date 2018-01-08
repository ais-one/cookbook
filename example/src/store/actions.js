import * as firebase from 'firebase'

export default {
  async signUserUp ({commit}, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let user = null
    try {
      user = await firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
    } catch (e) { }
    commit('setLoading', false)
    if (user) {
      const newUser = {id: user.uid, email: payload.email}
      commit('setUser', newUser)
    } else {
      commit('setError', {message: 'Error Signup'})
/* TBD
      if (error.code === 'auth/email-already-in-use') {
        const auth = firebase.auth()
        var credential = firebase.auth.EmailAuthProvider.credential(payload.email, payload.password)
        user = await auth.currentUser.linkWithCredential(credential)
        if (user) {
          const newUser = {id: user.uid}
          commit('setUser', newUser)
        }
      }
*/
    }
  },
  async signUserIn ({commit}, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let user = null
    try {
      user = await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      // firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()) // FacebookAuthProvider
    } catch (e) { }
    if (!user) { // else ok - autoSignIn user to sign in user
      commit('setError', {message: 'Sign In Error'}) // not null means error
    }
    commit('setLoading', false)
  },
  autoSignIn ({commit}, payload) {
    commit('setUser', {id: payload.uid, email: payload.email || payload.uid})
  },
  logout ({commit}) {
    firebase.auth().signOut()
    commit('setUser', null)
    window.location.replace('/')
    this.$router.push('/')
  },
  clearError ({commit}) { commit('setError', null) }
}
