import store from './store.js'
import Dashboard from './views/dashboard.js'
import Admin from './views/admin.js'
import SignIn from './views/signin.js'

const { createRouter, createWebHistory } = VueRouter

const routerHistory = createWebHistory()

const AuthGuard = async (to, from, next) => {
  console.log('AuthGuard', store)
  if (store.getters.user) {
    return next()
  } else {
    return next('/')
  }
}

const router = createRouter({
  history: routerHistory,
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
    {
      beforeEnter: AuthGuard,
      path: '/admin',
      component: Admin, // () => import('./views/about.js') // TBD use lazy loading
      name: 'admin'
    },
    { path: '/', name: 'signIn', component: SignIn }
    // { path: '/:catchAll(.*)', name: 'SignIn', redirect: '{ name: 'SignIn' }' }, // should have 404 page
  ]
})

export default router
