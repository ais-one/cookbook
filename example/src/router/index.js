import Vue from 'vue'
import Router from 'vue-router'

// import SignUp from '@/components/User/SignUp'
import SignIn from '@/components/User/SignIn'
import AuthGuard from './auth-guard'
import ExampleForm from '@/components/ExampleForm'

// vue-crud-x component
import VueCrudX from '@/VueCrudX' // copy the source vue file here if you want to tinker with it
// import VueCrudX from 'vue-crud-x' // usually we will install and import

import * as partyDefs from '@/components/Crud/party'
import * as partyInlineDefs from '@/components/Crud/party-inline'
import * as partyNotesDefs from '@/components/Crud/party-notes'
import * as noteDefs from '@/components/Crud/notes'
import * as noteDefs2 from '@/components/Crud/notes2'

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
          ...noteDefs,
          crudTitle: 'My Title'
        }
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
      props: (route) => { return { storeName: route.name, parentId: route.params.parentId || null, ...partyInlineDefs, doPage: false } },
      beforeEnter: AuthGuard
    },
    {
      path: '/party',
      name: 'party',
      component: VueCrudX,
      props: (route) => { return { storeName: route.name, parentId: route.params.parentId || null, ...partyDefs, doPage: false } },
      beforeEnter: AuthGuard
    },
    {
      path: '/party-notes/:parentId',
      name: 'party-notes',
      component: VueCrudX,
      props: (route) => { return { storeName: route.name, parentId: route.params.parentId || null, ...partyNotesDefs, doPage: false } },
      beforeEnter: AuthGuard
    },
    { path: '/example-form', name: 'Example Form', component: ExampleForm },
    // { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/', name: 'SignIn', component: SignIn },
    { path: '*', redirect: '/' }
  ],
  mode: 'history'
})
