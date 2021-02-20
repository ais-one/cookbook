import { createRouter, createWebHistory } from 'vue-router'
import store from './store.js'
import { BASE_URL } from '../config.js'

// const permissions = {
//   // g1 = route groups, g2 = user groups
//   // go through each route group... check if group matches [list of groups in user]
//   allowed: (g1, g2) => g1.find(x => g2.includes(x))
// }

// const routeGroups = {
//   // '/authors', '/categories', '/books', '/pages', '/books/:id/pages'
//   '/test': ['TestGroup'] //
// }

const authGuard = (to, from, next) => {
  // console.log('authGuard', store.state.user ? 'user' : 'anon', from.path, to.path)

  // TBD find users from localStorage? // potential security leak
  // const item = localStorage.getItem('session') // survive a refresh - POTENTIAL SECURITY RISK - TO REVIEW AND CHANGE USE HTTPONLY COOKIES
  // if (item) {
  //   const user = JSON.parse(item)
  //   if (user.verified) {
  //     store.commit('setUser', user) // need user.token only
  //   }
  // }

  const loggedIn = !!(store.state.user && store.state.user.verified)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // const { groups } = store.state.user
  // if (routeGroups[to.matched[0].path]) {
  //   let found = permissions.allowed(routeGroups[to.matched[0].path], groups.split(','))
  //   if (!found) {
  //     alert('Forbidden... Check Page Permissions')
  //     return next('/')
  //   }
  // }
  if (loggedIn === requiresAuth) {
    next()
  } else if (!loggedIn && requiresAuth) {
    next('/signin')
  } else if (loggedIn && !requiresAuth) {
    next('/dashboard')
  } else {
    // should not get here
    console.log(loggedIn, requiresAuth)
  }
}

const routerHistory = createWebHistory(BASE_URL)

const router = createRouter({
  history: routerHistory,
  routes: [
    // public
    // { path: '/', name: 'Home', component: () => import('./views/Home.vue') },
    { path: '/signin', name: 'SignIn', component: () => import('./views/SignIn.vue'), beforeEnter: authGuard, meta: { requiresAuth: false, layout: 'layout-public' } },
    { path: '/signup', name: 'SignUp', component: () => import('./views/SignUp.vue'), beforeEnter: authGuard, meta: { requiresAuth: false, layout: 'layout-public' } },
    { path: '/callback', name: 'Callback', component: () => import('./views/Callback.vue'), beforeEnter: authGuard, meta: { requiresAuth: false, layout: 'layout-public' } },
    // catchall
    { path: '/:catchAll(.*)', name: 'catchAll', redirect: { name: 'SignIn' }, meta: { requiresAuth: false, layout: 'layout-public' } },
    // private
    { path: '/dashboard', name: 'Dashboard', component: async () => await import('./views/Dashboard.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-web-cam', name: 'Demo Web Cam', component: () => import('./views/DemoWebCam.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-sign-pad', name: 'Demo Sign Pad', component: async () => await import('./views/DemoSignPad.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-chart', name: 'Demo Chart', component: () => import('./views/DemoChart.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-map', name: 'Demo Map', component: () => import('./views/DemoMap.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-flex', name: 'DemoFlex', component: () => import('./views/DemoFlex.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } }
  ]
})

export default router
