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

  const loggedIn = !!(store.state.user)
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
    // console.log('logged in', loggedIn, requiresAuth)
    next()
  } else if (!loggedIn && requiresAuth) {
    next('/signin')
  } else if (loggedIn && !requiresAuth) {
    next('/dashboard')
  } else {
    // should not get here
    console.log('router should not get here', loggedIn, requiresAuth)
  }
}

const routerHistory = createWebHistory(BASE_URL)

const router = createRouter({
  history: routerHistory,
  routes: [
    // public
    { path: '/', name: 'Home', component: () => import('./views/signIn.vue') },
    { path: '/signin', name: 'SignIn', component: () => import('./views/SignIn.vue'), beforeEnter: authGuard, meta: { requiresAuth: false, layout: 'layout-public' } },
    { path: '/callback', name: 'Callback', component: () => import('./views/Callback.vue'), beforeEnter: authGuard, meta: { requiresAuth: false, layout: 'layout-public' } },

    // catchall
    { path: '/:catchAll(.*)', name: 'catchAll', redirect: { name: 'SignIn' }, meta: { requiresAuth: false, layout: 'layout-public' } },

    // private
    { path: '/dashboard', name: 'Dashboard', component: async () => await import('./views/Dashboard.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-chart1', name: 'DemoChart1', component: async () => await import('./views/Visuals/DemoChart1.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-chart2', name: 'DemoChart2', component: async () => await import('./views/Visuals/DemoChart2.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-table', name: 'DemoTable', component: async () => await import('./views/DemoTable.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/cascade-ms', name: 'CascadeMs', component: async () => await import('./views/DataEntry/CascadeMs.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-form', name: 'DemoForm', component: async () => await import('./views/DataEntry/DemoForm.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-card', name: 'DemoCard', component: async () => await import('./views/DataEntry/DemoCard.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-map', name: 'DemoMap', component: async () => await import('./views/Visuals/DemoMap.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },

    { path: '/major-gift', name: 'MajorGift', component: async () => await import('./views/NTU_CSR/MajorGift.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/appeal-m', name: 'AppealM', component: async () => await import('./views/NTU_CSR/AppealM.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
  ]
})

export default router
