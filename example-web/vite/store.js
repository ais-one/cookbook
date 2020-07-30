import { createStore } from 'vuex'

import router from './router.js'
// import { createStore } from 'vuex/dist/vuex.esm-bundler.js'

// import aaa from 'https://unpkg.com/swrv@0.3.0/esm/index.js' - will error

// Vuex will fail if below line is commented - being fixed in https://github.com/vuejs/vuex/issues/1730
// window.process = { env: { NODE_ENV: '' } }

const state = {
  count: 99,
  token: ''
}

const mutations = {
  login (state, payload) {
    console.log('setToken', payload)
    state.token = payload
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
    if (payload) { // sign in ok
      commit('login', `Token:${payload}:${Date.now()}`)
      router.push('/dashboard')
    } else { // sign in failed
      commit('login', '')
      router.push('/')
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
