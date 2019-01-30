import Vue from 'vue'
import Router from 'vue-router'

import VueCrudX from '@/VueCrudX' // copy the source vue file here if you want to tinker with it

import AuthGuard from './auth-guard'

import SignIn from '@/pages/SignIn'
import SignUp from '@/pages/SignUp'
import Dashboard from '@/pages/Dashboard'

import * as authorDefs from '@/components/author'
import * as categoryDefs from '@/components/category'
import Book from '@/pages/Book'
import Page from '@/pages/Page'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/dashboard', name: 'dashboard', component: Dashboard, beforeEnter: AuthGuard },
    {
      path: '/authors',
      name: 'authors',
      component: VueCrudX,
      beforeEnter: AuthGuard,
      props: (route) => ({ storeName: route.name, parentId: route.params.parentId || null, ...authorDefs })
    },
    {
      path: '/categories',
      name: 'categories',
      component: VueCrudX,
      beforeEnter: AuthGuard,
      props: (route) => ({ storeName: route.name, parentId: route.params.parentId || null, ...categoryDefs })
    },
    { path: '/books', name: 'books', component: Book, beforeEnter: AuthGuard },
    { path: '/books/:id/pages', name: 'pages', component: Page, beforeEnter: AuthGuard },
    { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/', name: 'SignIn', component: SignIn },
    { path: '*', redirect: '/' }
  ],
  mode: 'history'
})
