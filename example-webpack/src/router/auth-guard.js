import { store } from '@/store'
import permissions from '@/permissions'
const routeGroups = {
  // '/authors', '/categories', '/books', '/pages', '/books/:id/pages'
  '/test': ['TestGroup'] //
}

export default (to, from, next) => {
  // console.log('route', to.matched[0].path, store.state.user)
  if (store.state.user) {
    const { groups } = store.state.user
    if (routeGroups[to.matched[0].path]) {
      let found = permissions.allowed(routeGroups[to.matched[0].path], groups.split(','))
      if (!found) {
        alert('Forbidden... Check Page Permissions')
        return next('/')  
      }
    }
    return next()
  } else {
    // TBD save / restore last path
    const item = localStorage.getItem('session') // survive a refresh - POTENTIAL SECURITY RISK - TO REVIEW AND CHANGE USE HTTPONLY COOKIES
    if (item) {
      const user = JSON.parse(item)
      store.commit('setUser', user) // need user.token only
      store.commit('setLayout', 'layout-admin')
      return next()
    }
    return next('/')
  }
}
