import { createRouter, createWebHistory } from 'vue-router'

import store from './store'

const authGuard = (to, from, next) => {
  // console.log('route', to.matched[0].path, store)
  if (store.state.user) { // has user && otp is verified
    return next()
  } else {
    store.commit('login', null) // need user.token only
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
    { path: '/demo-web-cam', name: 'Demo Web Cam', component: () => import('./pages/DemoWebCam.vue'), beforeEnter: authGuard },
    { path: '/demo-sign-pad', name: 'Demo Sign Pad', component: () => import('./pages/DemoSignPad.vue'), beforeEnter: authGuard },
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

/*
import permissions from '@/permissions'
const routeGroups = {
  // '/authors', '/categories', '/books', '/pages', '/books/:id/pages'
  '/test': ['TestGroup'] //
}

export default (to, from, next) => {
  // console.log('route', to.matched[0].path, store.state.user)
  if (store.state.user && store.state.user.verified) { // has user && otp is verified
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
      if (user.verified) {
        store.commit('setUser', user) // need user.token only
        store.commit('setLayout', 'layout-admin')
        return next()
      }
    }
    return next('/')
  }
}
*/