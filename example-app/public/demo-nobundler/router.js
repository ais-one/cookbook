import store from './store.js'
import Dashboard from './views/dashboard.js'
import Admin from './views/admin.js'
import SignIn from './views/signin.js'

const { createRouter, createWebHistory } = VueRouter

const routerHistory = createWebHistory('/demo-nobundler/')

const AuthGuard = async (to, from, next) => {
  // console.log('AuthGuard', store)
  const loggedIn = Boolean(store.state.user)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (loggedIn === requiresAuth) {
    return next()
  } else if (!loggedIn && requiresAuth) {
    return next('/signin')
  } else if (loggedIn && !requiresAuth) {
    return next('/dashboard')
  } else {
    // should not get here
    // console.log(loggedIn, requiresAuth)
    return next('/signin')
  }
}

const router = createRouter({
  history: routerHistory,
  // linkActiveClass: '' // set class of active links <a tags> etc.
  routes: [
    {
      meta: { requiresAuth: true, layout: 'layout-secure' },
      beforeEnter: AuthGuard,
      // props: (route) => ({ storeName: route.name, parentId: route.params.parentId || null }),
      path: '/dashboard',
      component: Dashboard, // () => import('./views/about.js') // TBD use lazy loading
      name: 'dashboard'
    },
    {
      meta: { requiresAuth: true, layout: 'layout-secure' },
      beforeEnter: AuthGuard,
      path: '/admin',
      component: Admin, // () => import('./views/about.js') // TBD use lazy loading
      name: 'admin'
    },
    {
      meta: { requiresAuth: false, layout: 'layout-public' },
      path: '/',
      name: 'signIn',
      component: SignIn
    },
    {
      meta: { requiresAuth: false, layout: 'layout-public' },
      path: '/:catchAll(.*)',
      name: 'catchAll',
      redirect: { name: 'signIn' }
    }, // should have 404 page
  ]
})

export default router
