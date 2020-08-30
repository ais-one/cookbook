import { createRouter, createWebHistory } from 'vue-router'

import store from './store'

const authGuard = (to, from, next) => {
  // console.log('route', to.matched[0].path, store)
  if (store.state.token) { // has user && otp is verified
    return next()
  } else {
    store.commit('login', '') // need user.token only
    // store.commit('setLayout', 'layout-admin')
    return next('/')
  }
}

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    // public
    // { path: '/', name: 'Home', component: () => import('./pages/Home.vue') },
    { path: '/', name: 'SignIn', component: () => import('./pages/SignIn.vue') },
    { path: '/signup', name: 'SignUp', component: () => import('./pages/SignUp.vue') },
    // private
    { path: '/dashboard', name: 'Dashboard', component: () => import('./pages/Dashboard.vue'), beforeEnter: authGuard },
    { path: '/demo-chart', name: 'Demo Chart', component: () => import('./pages/DemoChart.vue'), beforeEnter: authGuard },
    { path: '/demo-map', name: 'Demo Map', component: () => import('./pages/DemoMap.vue'), beforeEnter: authGuard },
    { path: '/table-grade-slot', props: route => ({ query: route.query }), name: 'TableGradeSlot', component: () => import('./pages/TableGradeSlot.vue'), beforeEnter: authGuard },
    { path: '/table-person', props: route => ({ query: route.query, tableName: 'person' }), name: 'TablePerson', component: () => import('./components/CrudTable.vue'), beforeEnter: authGuard },
    { path: '/table-country', props: route => ({ query: route.query, tableName: 'country' }), name: 'TableCountry', component: () => import('./components/CrudTable.vue'), beforeEnter: authGuard },
    { path: '/demo-flex', name: 'DemoFlex', component: () => import('./pages/DemoFlex.vue'), beforeEnter: authGuard },
    // catchall
    { path: '/:catchAll(.*)', redirect: '/' }
  ]
})

export default router
