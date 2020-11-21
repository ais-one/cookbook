const { createStore } = Vuex

const mutations = {
  setUser (state, payload) { state.user = payload }
}

const getters = {
  user (state) { return state.user }
}

const state = { // state below the rest // https://stackoverflow.com/questions/43843180/eslint-state-already-declared-vuex
  user: null
}

const store = createStore({
  state,
  getters,
  actions: {},
  mutations
})

export default store
