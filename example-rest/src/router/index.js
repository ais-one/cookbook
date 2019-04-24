import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'

import * as authorDefs from '@/components/author'
import VueCrudX from '../../../src/VueCrudX' // Component shared between projects
// const VueCrudX = Vue.component('vue-crud-x') // does not work!

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/authors',
      name: 'authors',
      // component: () => Vue.component('vue-crud-x'), // not working
      component: VueCrudX,
      beforeEnter: AuthGuard,
      props: (route) => ({ storeName: route.name, parentId: route.params.parentId || null, ...authorDefs })
    },
    // route level code splitting, components are lazy loaded using import
    { path: '/dashboard', name: 'dashboard', component: () => import('@/pages/Dashboard'), beforeEnter: AuthGuard },
    { path: '/books', name: 'books', component: () => import('@/pages/Book'), beforeEnter: AuthGuard },
    { path: '/books/:id/pages', name: 'pages', component: () => import('@/pages/Page'), beforeEnter: AuthGuard },
    { path: '/categories', name: 'categories', component: () => import('@/pages/Category'), beforeEnter: AuthGuard },
    { path: '/signup', name: 'SignUp', component: () => import('@/pages/SignUp') },
    { path: '/', name: 'SignIn', component: () => import('@/pages/SignIn') },
    { path: '*', redirect: '/' }
  ],
  mode: 'history'
})
