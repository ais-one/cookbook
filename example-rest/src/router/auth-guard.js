import { store } from '../store'

const permissions = {
  'all': ['/test', '/dashboard'],
  'rest': ['/authors', '/categories', '/books', '/pages', '/books/:id/pages'],
  'mongo': ['/mongo-test'],
  'firebase': ['/firebase-rt', '/firebase-storage']
}

export default (to, from, next) => {
  // console.log('route', to.matched[0].path)
  if (store.getters.user && store.getters.user.otpVerified) { // has user && otp is verified
    const { loginType } = store.getters.user
    let idx = -1
    if (permissions[loginType]) idx = permissions[loginType].indexOf(to.matched[0].path)
    if (idx === -1) idx = permissions['all'].indexOf(to.matched[0].path) // try again
    if (idx === -1) { // Forbidden
      alert('Forbidden... Check Page Permissions')
      next('/')
    } else {
      next()
    }
  } else {
    // TBD save / restore last path
    const item = localStorage.getItem('session') // survive a refresh
    if (item) {
      const user = JSON.parse(item)
      if (user.otpVerified) {
        console.log('auth guard set user')
        store.commit('setUser', user)
        store.commit('setLayout', 'layout-admin')
        return next()
      }
    }
    return next('/')
  }
}
