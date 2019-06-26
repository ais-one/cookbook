import Vue from 'vue'
import Router from 'vue-router'

// import SignUp from '@/pages/User/SignUp'
import AuthGuard from './auth-guard'

import SignIn from '@/pages/User/SignIn'
import MultiCrudExample from '@/pages/MultiCrud/Example'
import RealtimeExample from '@/pages/Realtime/Example'
import party from '@/pages/Crud/party.vue'
import partyNotes from '@/pages/Crud/partyNotes.vue'
import * as partyInlineDefs from '@/pages/Crud/party-inline'

import MongoTest from '@/pages/MongoTest'

import VueCrudX from '../../../src/VueCrudX' // Component shared between projects // const VueCrudX = Vue.component('vue-crud-x') this does not work...
// import VueCrudX from 'vue-crud-x'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/mongo-test',
      name: 'mongo-test',
      component: MongoTest,
      beforeEnter: AuthGuard
    },
    {
      path: '/party-inline',
      name: 'party-inline',
      component: VueCrudX,
      props: (route) => { return { parentId: route.params.parentId || null, ...partyInlineDefs } },
      beforeEnter: AuthGuard
    },
    {
      path: '/party',
      name: 'party',
      component: party, // VueCrudX,
      beforeEnter: AuthGuard
    },
    {
      path: '/party-notes/:parentId',
      name: 'party-notes',
      component: partyNotes, // VueCrudX,
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
    { path: '/', name: 'SignIn', component: SignIn },
    { path: '*', redirect: '/' }
  ],
  mode: 'history'
})
