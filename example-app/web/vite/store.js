import { createStore } from 'vuex'
// import { createStore } from 'vuex/dist/vuex.esm-bundler.js'

// import aaa from 'https://unpkg.com/swrv@0.3.0/esm/index.js' - will error

// Vuex will fail if below line is commented - being fixed in https://github.com/vuejs/vuex/issues/1730
// window.process = { env: { NODE_ENV: '' } }

const store = createStore({
  state () {
    return {
      count: 100
    }
  }
})

// const store = 123

export default store
