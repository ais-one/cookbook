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
    console.log('doLogin', payload)
    if (payload) {
      if (payload.forced) { //  forced - refresh token error
        // console.log('payload forced === true')
        commit('login', null)
        await router.push('/')
      } else { // sign in ok
        commit('login', payload)
        await router.push('/dashboard')
      }
    } else { // sign in failed
      // console.log('payload forced === false')
      try {
        await http.get('/api/auth/logout')
        commit('login', null)
        await router.push('/')
      } catch (e) {
        if (e && e.data && e.data.message !== 'Token Expired Error') {
          commit('login', null)
          await router.push('/')  
        }
      }
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
