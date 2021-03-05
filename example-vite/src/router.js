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
    console.log('router should not get here', loggedIn, requiresAuth)
  }
}

const routerHistory = createWebHistory(BASE_URL)

const router = createRouter({
  history: routerHistory,
  routes: [
    // public
    // { path: '/', name: 'Home', component: () => import('./views/Home.vue') },
    { path: '/signin', name: 'SignIn', component: () => import('./views/SignIn.vue'), beforeEnter: authGuard, meta: { requiresAuth: false, layout: 'layout-public' } },
    { path: '/signin-fast', name: 'SignInFast', component: () => import('./views/SignInFast.vue'), beforeEnter: authGuard, meta: { requiresAuth: false, layout: 'layout-public' } },
    { path: '/signup', name: 'SignUp', component: () => import('./views/SignUp.vue'), beforeEnter: authGuard, meta: { requiresAuth: false, layout: 'layout-public' } },
    { path: '/callback', name: 'Callback', component: () => import('./views/Callback.vue'), beforeEnter: authGuard, meta: { requiresAuth: false, layout: 'layout-public' } },
    // catchall
    { path: '/:catchAll(.*)', name: 'catchAll', redirect: { name: 'SignIn' }, meta: { requiresAuth: false, layout: 'layout-public' } },
    // demo
    { path: '/dashboard', name: 'Dashboard', component: async () => import('./views/Dashboard.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-web-cam', name: 'Demo Web Cam', component: () => import('./views/demo/DemoWebCam.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-sign-pad', name: 'Demo Sign Pad', component: async () => import('./views/demo/DemoSignPad.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-chart', name: 'Demo Chart', component: () => import('./views/demo/DemoChart.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-map', name: 'Demo Map', component: () => import('./views/demo/DemoMap.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-main', name: 'DemoMain', component: () => import('./views/demo/DemoMain.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },

    // more demo
    { path: '/demo-chart1', name: 'DemoChart1', component: async () => import('./views/Visuals/DemoChart1.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-chart2', name: 'DemoChart2', component: async () => import('./views/Visuals/DemoChart2.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-table', name: 'DemoTable', component: async () => import('./views/DemoTable.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/cascade-ms', name: 'CascadeMs', component: async () => import('./views/DataEntry/CascadeMs.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-form', name: 'DemoForm', component: async () => import('./views/DataEntry/DemoForm.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-card', name: 'DemoCard', component: async () => import('./views/DataEntry/DemoCard.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/demo-map', name: 'DemoMap', component: async () => import('./views/Visuals/DemoMap.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },

    // items
    { path: '/major-gift', name: 'MajorGift', component: async () => import('./views/NTU_CSR/MajorGift.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/appeal-m', name: 'AppealM', component: async () => import('./views/NTU_CSR/AppealM.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },
    { path: '/update-db', name: 'UpdateDb', component: async () => import('./views/NTU_CSR/UpdateDb.vue'), beforeEnter: authGuard, meta: { requiresAuth: true, layout: 'layout-secure' } },

  ]
})

export default router
