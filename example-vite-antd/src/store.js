import { createStore } from 'vuex'
import router from './router.js'

const mutations = {
  login(state, payload) {
    console.log('login', payload)
    state.user = payload
  }
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  doLogin: async ({ commit, ...ctx }, payload) => {
    // console.log('doLogin', payload)
    if (payload) {
      commit('login', payload)
      await router.push('/dashboard')
    } else {
      commit('login', null)
      await router.push('/signin')
    }
  }
}

// getters are functions.
const getters = {
  evenOrOdd: (payload) => (payload.count % 2 === 0 ? 'even' : 'odd')
}

// state below the rest // https://stackoverflow.com/questions/43843180/eslint-state-already-declared-vuex
const state = {
  count: 99,
  user: null
}

const store = createStore({
  state,
  getters,
  actions,
  mutations
})

// const store = 123

export default store
