const { createStore } = Vuex

const state = {
  user: null
}

const mutations = {
  setUser (state, payload) { state.user = payload }
}

const getters = {
  user (state) { return state.user }
}

const store = createStore({
  state,
  getters,
  actions: {},
  mutations
})

export default store
