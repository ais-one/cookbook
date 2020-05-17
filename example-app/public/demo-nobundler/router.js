
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.esm.browser.min.js'
import VueRouter from 'https://cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.esm.browser.min.js'
import Dashboard from './views/dashboard.js'
import AdminUsers from './views/admin/users.js'

import store from './store.js'

Vue.use(VueRouter)

const AuthGuard = async (to, from, next) => {
  if (store.getters.user) { // has user && otp is verified
    // next()
  } else {
    // localStorage.setItem('ms', JSON.stringify({ user: data.user, token: data.token }))
    let data
    try {
      data = JSON.parse(localStorage.getItem('ms')) // survive a refresh
    } catch (e) { }
    if (data) {
      store.commit('setUser', data.user)
      store.commit('setToken', data.token)
    } else {
      return next('/')
    }
  }
  // console.log(to, from)
  next()
}

export default new VueRouter({
  routes: [
    {
      beforeEnter: AuthGuard,
      // props: (route) => {
      //   return { storeName: route.name, parentId: route.params.parentId || null }
      // },
      path: '/dashboard',
      component: Dashboard, // () => import('./views/about.js') // TBD use lazy loading
      name: 'dashboard'
    },
    { beforeEnter: AuthGuard, path: '/admin-users', component: AdminUsers, name: 'admin-users' },
    // { path: '/', name: 'signIn', component: SignIn },
    // { path: '*', redirect: '/' }
  ],
  mode: 'history'
})
