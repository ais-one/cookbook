import { auth } from '@/firebase'
import { stitch, getUserPasswordCredential } from '@/mongo'
import { http } from '@/axios'
import router from '../router'

const USE_OTP = process.env.VUE_APP_USE_OTP || '' // set to true in production

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
      // TBD const newUser = {id: user.uid, email: payload.email} commit('setUser', newUser)
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
      data.verified = !USE_OTP
      dispatch('autoSignIn', data) // token
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
      data.verified = true
      dispatch('autoVerify', data) // token
    } catch (e) { }
    if (!rv) {
      commit('setError', { message: 'Verify Error' })
    }
    commit('setLoading', false)
  },

  async logout ({ commit }, payload) {
    commit('setLoading', true)
    if (payload.loginType === 'mongo') {
      await stitch.auth.logout()
    } else if (payload.loginType === 'firebase') {
      await auth.signOut()
    } else { // rest
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
      router.push('/')
      if (payload.forced) commit('setError', { message: 'Session Expired' })
    }
    commit('setUser', null)
    commit('setLayout', 'layout-default')
    commit('setLoading', false)
  },

  autoSignIn ({ commit }, payload) { // payload.token
    commit('setUser', payload)
    if (!USE_OTP) {
      commit('setLayout', 'layout-admin')
      router.push('/dashboard')
    }
  },

  autoVerify ({ commit }, payload) { // payload.token
    commit('setUser', payload)
    commit('setLayout', 'layout-admin')
    router.push('/dashboard')
  },
  clearError ({ commit }) { commit('setError', null) },

  setNetworkError ({ commit }, payload) { commit('mutateNetworkError', payload) },

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
      commit('setBaasUser', { id: auth.id, email: auth.id, loginType: 'mongo' })
      commit('setLayout', 'layout-admin')
      router.push('/mongo-test')
    }
  },
  mongoAutoSignin ({ commit }, payload) { // not called for now
    commit('setBaasUser', { id: payload.id, email: payload.id, loginType: 'mongo' })
    commit('setLayout', 'layout-admin')
    router.push('/mongo-test')
  },

  // firebase
  async firebaseSignup ({ commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let user = null
    try {
      user = await auth.createUserWithEmailAndPassword(payload.email, payload.password)
    } catch (e) { }
    commit('setLoading', false)
    if (user) {
      const newUser = { id: user.uid, email: payload.email }
      commit('setBaasUser', newUser)
    } else {
      commit('setError', { message: 'Error Signup' })
      /* TBD
        if (error.code === 'auth/email-already-in-use') {
          var credential = auth.EmailAuthProvider.credential(payload.email, payload.password)
          user = await auth.currentUser.linkWithCredential(credential)
          if (user) {
            const newUser = {id: user.uid}
            commit('setBaasUser', newUser)
          }
        }
      */
    }
  },
  async firebaseSignin ({ dispatch, commit }, payload) {
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
  firebaseAutoSignin ({ commit }, payload) {
    commit('setBaasUser', { id: payload.uid, email: payload.email, loginType: 'firebase' })
    commit('setLayout', 'layout-admin')
    router.push('/multi-crud-example') // console.log party
  }
}

/*
function doSomething() {
  console.log("10 seconds");
  setTimeout(doSomething, 10000)
}
setTimeout(doSomething, 10000)
*/
