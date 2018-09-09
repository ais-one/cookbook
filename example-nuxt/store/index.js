import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      sidebar: false,
      locales: ['en', 'fr'],
      locale: 'en',
      user: {
        email: 'test@abc.com',
        id: '123456',
        rules: { '*': ['*'] }
      },
      counter: 0
    },
    mutations: {
      toggleSidebar (state) {
        state.sidebar = !state.sidebar
      },
      SET_LANG (state, locale) {
        if (state.locales.indexOf(locale) !== -1) {
          state.locale = locale
        }
      },

      increment (state) {
        state.counter++
      }
    },
    getters: {
      user (state) { return state.user },
    }  
  })
}

export default createStore

// export const state = () => ({
//   sidebar: false,
//   locales: ['en', 'fr'],
//   locale: 'en'
// })

// export const mutations = {
//   toggleSidebar (state) {
//     state.sidebar = !state.sidebar
//   },
//   SET_LANG (state, locale) {
//     if (state.locales.indexOf(locale) !== -1) {
//       state.locale = locale
//     }
//   }
// }
