import { createStore } from 'vuex'
// import { createStore } from 'vuex/dist/vuex.esm-bundler.js'

// import aaa from 'https://unpkg.com/swrv@0.3.0/esm/index.js' - will error

// Vuex will fail if below line is commented - being fixed in https://github.com/vuejs/vuex/issues/1730
// window.process = { env: { NODE_ENV: '' } }

const state = {
  count: 99
}

const mutations = {
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
  increment: ({ commit }) => commit('increment'),
  decrement: ({ commit }) => commit('decrement'),
  incrementIfOdd ({ commit, state }) {
    if ((state.count + 1) % 2 === 0) {
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
  evenOrOdd: state => state.count % 2 === 0 ? 'even' : 'odd'
}

const store = createStore({
  state,
  getters,
  actions,
  mutations
  // state () {
  //   return {
  //     count: 100
  //   }
  // }
})

// const store = 123

export default store
