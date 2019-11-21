import { store } from '@/store'

const permissions = {
  'all': ['/test', '/dashboard'],
  'rest': ['/authors', '/categories', '/books', '/pages', '/books/:id/pages'],
  'mongo': ['/mongo-test'],
  'firebase': ['/firebase-rt', '/firebase-storage']
}

export default (to, from, next) => {
  // console.log('route', to.matched[0].path, store.state.user)
  if (store.state.user && store.state.user.verified) { // has user && otp is verified
    const { loginType } = store.state.user
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
    const item = localStorage.getItem('session') // survive a refresh - POTENTIAL SECURITY RISK - TO REVIEW AND CHANGE USE HTTPONLY COOKIES
    if (item) {
      const user = JSON.parse(item)
      if (user.verified) {
        store.commit('setUser', user) // need user.token only
        store.commit('setLayout', 'layout-admin')
        return next()
      }
    }
    return next('/')
  }
}
