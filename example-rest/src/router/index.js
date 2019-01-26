import Vue from 'vue'
import Router from 'vue-router'

import SignIn from '@/pages/SignIn'
import SignUp from '@/pages/SignUp'
import AuthGuard from './auth-guard'

import Dashboard from '@/pages/Dashboard'

// import Reports from '@/pages/Reports'

import VueCrudX from '@/VueCrudX' // copy the source vue file here if you want to tinker with it
// import * as reportsDefs from '@/components/reports'
import Reports from '@/pages/Reports'
import * as authorDefs from '@/pages/author'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: AuthGuard
    },
    {
      path: '/authors',
      name: 'authors',
      component: VueCrudX,
      beforeEnter: AuthGuard,
      props: (route) => ({ storeName: route.name, parentId: route.params.parentId || null, ...authorDefs })
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports,
      beforeEnter: AuthGuard
    },
    { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/', name: 'SignIn', component: SignIn },
    { path: '*', redirect: '/' }
  ],
  mode: 'history'
})
