import Vue from 'vue'
import Router from 'vue-router'
// import SignUp from '@/components/User/SignUp'
import SignIn from '@/components/User/SignIn'
import AuthGuard from './auth-guard'

import VueCrudX from 'vue-crud-x'
import * as noteDefs from '@/components/Note/config'
import * as noteDefs2 from '@/components/Note/config2'
import * as noteDefsS from '@/components/Note/configS'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/notes',
      name: 'notes',
      component: VueCrudX, // () => import('@/components/Note') // lazy loading
      beforeEnter: AuthGuard,
      props: (route) => {
        return {
          storeName: route.name,
          parentId: route.params.parentId || null,
          jwtToken: '',
          userId: this.a.app.$store.getters.user.email,
          ...noteDefs
        }
      }
    },
    {
      path: '/notes2',
      name: 'notes2',
      component: VueCrudX,
      beforeEnter: AuthGuard,
      props: (route) => {
        return {
          storeName: route.name,
          parentId: route.params.parentId || null,
          jwtToken: '',
          userId: this.a.app.$store.getters.user.email,
          ...noteDefs2
        }
      }
    },
    {
      path: '/notesS/:parentId',
      name: 'notesS',
      component: VueCrudX,
      props: (route) => {
        return {
          storeName: route.name,
          parentId: route.params.parentId || null,
          jwtToken: '',
          userId: this.a.app.$store.getters.user.email,
          ...noteDefsS
        }
      },
      beforeEnter: AuthGuard
    },
    // { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/', name: 'SignIn', component: SignIn },
    { path: '*', redirect: '/' }
  ],
  mode: 'history'
})
