import { createStore } from 'vuex'
import router from './router.js'
import { http } from '/src/services.js'
// import aaa from 'https://unpkg.com/swrv@0.3.0/esm/index.js' - will error
import { INITIAL_SECURE_PATH, INITIAL_PUBLIC_PATH } from '/config.js'

const mutations = {
  login(state, payload) {
    console.log('login', payload)
    state.user = payload
  },
  increment(state) {
    state.count++
  },
  decrement(state) {
    state.count--
  }
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  doLogin: async ({ commit, ...ctx }, payload) => {
    // console.log('doLogin', payload)
    if (payload) {
      if (payload.forced) {
        //  forced - refresh token error
        // console.log('payload forced === true')
        commit('login', null)
        await router.push(INITIAL_PUBLIC_PATH)
      } else {
        // sign in ok
        commit('login', payload)
        await router.push(INITIAL_SECURE_PATH)
      }
    } else {
      // sign in failed
      // console.log('payload forced === false')
      try {
        await http.get('/api/auth/logout')
        commit('login', null)
        await router.push(INITIAL_PUBLIC_PATH)
      } catch (e) {
        if (e.toString() === 'TypeError: Failed to fetch' || (e.data && e.data.message !== 'Token Expired Error')) {
          commit('login', null)
          await router.push(INITIAL_PUBLIC_PATH)
        }
      }
    }
  },
  increment: ({ commit }) => commit('increment'),
  decrement: ({ commit }) => commit('decrement'),
  incrementIfOdd({ commit, payload }) {
    if ((payload.count + 1) % 2 === 0) {
      commit('increment')
    }
  },
  incrementAsync({ commit }) {
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
  evenOrOdd: (payload) => (payload.count % 2 === 0 ? 'even' : 'odd')
}

// state below the rest // https://stackoverflow.com/questions/43843180/eslint-state-already-declared-vuex
const state = {
  count: 99,
  user: null // id, groups
}

const store = createStore({
  state,
  getters,
  actions,
  mutations
})

export default store
