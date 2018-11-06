import Vue from 'vue'
import Router from 'vue-router'

// vue-crud-x component
import VueCrudX from '@/VueCrudX' // use the source vue file
// import VueCrudX from 'vue-crud-x' // usually we will install and import

// import SignUp from '@/pages/User/SignUp'
import AuthGuard from './auth-guard'

import SignIn from '@/pages/User/SignIn'
import MultiCrudExample from '@/pages/MultiCrud/Example'
import RealtimeExample from '@/pages/Realtime/Example'

import * as partyDefs from '@/pages/Crud/party'
import * as partyInlineDefs from '@/pages/Crud/party-inline'
import * as partyNotesDefs from '@/pages/Crud/party-notes'
import * as noteDefs from '@/pages/Crud/notes'
import * as noteDefs2 from '@/pages/Crud/notes2'

import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/notes',
      name: 'notes',
      component: VueCrudX, // () => import('@/components/Note') // lazy loading
      beforeEnter: AuthGuard,
      props: (route) => {
        return { storeName: route.name, parentId: route.params.parentId || null, ...noteDefs }
      }
    },
    {
      path: '/notes2',
      name: 'notes2',
      component: VueCrudX,
      beforeEnter: AuthGuard,
      props: (route) => {
        return { storeName: route.name, parentId: route.params.parentId || null, ...noteDefs2 }
      }
    },
    {
      path: '/party-inline',
      name: 'party-inline',
      component: VueCrudX,
      props: (route) => { return { storeName: route.name, parentId: route.params.parentId || null, ...partyInlineDefs } },
      beforeEnter: AuthGuard
    },
    {
      path: '/party',
      name: 'party',
      component: VueCrudX,
      props: (route) => { return { storeName: route.name, parentId: route.params.parentId || null, ...partyDefs } },
      beforeEnter: AuthGuard
    },
    {
      path: '/party-notes/:parentId',
      name: 'party-notes',
      component: VueCrudX,
      props: (route) => { return { storeName: route.name, parentId: route.params.parentId || null, ...partyNotesDefs } },
      beforeEnter: AuthGuard
    },
    {
      path: '/multi-crud-example',
      name: 'Multi Crud Example',
      component: MultiCrudExample,
      beforeEnter: AuthGuard
    },
    {
      path: '/realtime-example',
      name: 'Realtime Example',
      component: RealtimeExample,
      beforeEnter: AuthGuard
    },
    { path: '/test', name: 'Test', component: Test },
    // { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/', name: 'SignIn', component: SignIn },
    { path: '*', redirect: '/' }
  ],
  mode: 'history'
})
