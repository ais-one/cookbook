import Vue from 'vue'
import Router from 'vue-router'

import SignUp from '@/components/User/SignUp'
import SignIn from '@/components/User/SignIn'
import AuthGuard from './auth-guard'

import VueCrudX from '@/VueCrudX' // copy the source vue file here if you want to tinker with it

import * as userDefs from '@/components/Crud/user'
import * as resourceDefs from '@/components/Crud/resource'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/user',
      name: 'myuser',
      component: VueCrudX,
      props: (route) => { return { storeName: route.name, parentId: route.params.parentId || null, ...userDefs, doPage: false } },
      beforeEnter: AuthGuard
    },
    {
      path: '/resource',
      name: 'resource',
      component: VueCrudX,
      props: (route) => { return { storeName: route.name, parentId: route.params.parentId || null, ...resourceDefs, doPage: false } },
      beforeEnter: AuthGuard
    },
    { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/', name: 'SignIn', component: SignIn },
    { path: '*', redirect: '/' }
  ],
  mode: 'history'
})
