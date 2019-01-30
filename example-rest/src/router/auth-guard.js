import { store } from '../store'

export default (to, from, next) => {
  if (store.getters.user && store.getters.user.verified) { // has user && otp is verified
    next()
  } else {
    // TBD save / restore last path
    const item = localStorage.getItem('session') // survive a refresh
    if (item) {
      const user = JSON.parse(item)
      store.commit('setUser', user)
      store.commit('setLayout', 'layout-admin')
      return next()
    }
    return next('/')
  }
}
