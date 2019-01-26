import { store } from '../store'
import { http } from '@/axios'

export default (to, from, next) => {
  if (store.getters.user && store.getters.user.verified) { // has user && otp is verified
    next()
  } else {
    const item = localStorage.getItem('session')
    console.log('bbb', item)
    if (item) {
      const user = JSON.parse(item)
      console.log(to, user)
      http.defaults.headers.common['Authorization'] = 'Bearer ' + user.token
      store.commit('setUser', user)
      store.commit('setLayout', 'layout-admin')
      console.log('okok', to.path)
      return next()
    }
    return next('/')
  }
}
