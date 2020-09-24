import { createStore } from 'vuex'

import router from './router.js'

import * as http from '/src/lib/esm/http.js'

// import aaa from 'https://unpkg.com/swrv@0.3.0/esm/index.js' - will error

const state = {
  count: 99,
  user: null
}

const mutations = {
  login (state, payload) {
    console.log('login', payload)
    state.user = payload
  },
  increment (state) {
    state.count++
  },
  decrement (state) {
    state.count--
  }
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  doLogin: async ({ commit, ...ctx }, payload) => {
    // await fetch here to get token from API...
    console.log('doLogin - http', http)
    if (payload) {
      if (payload.forced) { //  forced...
        console.log('payload forced === true')

        commit('login', null)
        await router.push('/')
      } else { // sign in ok
        commit('login', payload)
        await router.push('/dashboard')
      }
    } else { // sign in failed
      console.log('payload forced === false')
      // if (payload.forced) { // auth failure detected
      // } else { // logout button clicked
      try {
        await http.get('/api/auth/logout')
      } catch (e) {
        // if (!e.response || e.response.status === 401) { // server or authorization error
        //   // ok please continue
        // } else {
        //   return // may have problems here... loading still true, etc...
        // }
      }
      // }
      // if (payload.forced) commit('setError', { message: 'Session Expired' })
      // commit('setLayout', 'layout-default')
      commit('login', null)
      await router.push('/')
    }
  },
  increment: ({ commit }) => commit('increment'),
  decrement: ({ commit }) => commit('decrement'),
  incrementIfOdd ({ commit, payload }) {
    if ((payload.count + 1) % 2 === 0) {
      commit('increment')
    }
  },
  incrementAsync ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('increment')
        resolve()
      }, 1000)
    })
  }
}

// getters are functions.
const getters = {
  evenOrOdd: payload => payload.count % 2 === 0 ? 'even' : 'odd'
}

const store = createStore({
  state,
  getters,
  actions,
  mutations
})

// const store = 123

export default store
