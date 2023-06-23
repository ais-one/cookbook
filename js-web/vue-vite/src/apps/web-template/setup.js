import { openWs, closeWs } from './hookFns.js'

// :key="$route.fullPath" // this is causing problems
import layoutPublic from '../../layouts/Public.vue' // you can change this to your own layout
import layoutSecure from '../../layouts/Secure.vue' // as above

export default {
  LAYOUTS: {
    layoutPublic,
    layoutSecure
  },
  ROUTES: [
    // you can change this to your custom views for Not Found and Not Allowed (Forbidden) view
    // { path: '/:catchAll(.*)', name: 'catchAll', redirect: { name: 'SignIn' }, meta: { requiresAuth: false, layout: 'layout-public' } },
    { path: '/forbidden', name: 'NotAllowed', component: () => import('../../views/NotAllowed.vue') },
    { path: '/:catchAll(.*)', name: 'NotFound', component: () => import('../../views/NotFound.vue') }
  ],
  PUBLIC_ROUTES: [
    { path: '/', name: 'Home', component: () => import('./views/SignInFast.vue') },
    { path: '/signin', name: 'SignInFast', component: () => import('./views/SignInFast.vue') },
    { path: '/callback', name: 'Callback', component: () => import('./views/Callback.vue') }
  ],
  SECURE_ROUTES: [
    { path: '/dashboard', name: 'Dashboard', component: async () => import('./views/Dashboard.vue') },
    { path: '/demo/test', name: 'Tests', component: async () => import('./views/Demo/DemoTest.vue') },
    { path: '/demo/table-edit', name: 'Table Edit', component: async () => import('./views/Demo/DemoTableEdit.vue') },
    { path: '/demo/table', name: 'Table', component: async () => import('./views/Demo/DemoTable.vue') },
    { path: '/demo/table-crud', name: 'Table CRUD', component: async () => import('./views/Demo/DemoTableCrud.vue') }
  ],
  INITIAL_PUBLIC_PATH: '/signin',
  INITIAL_SECURE_PATH: '/dashboard',

  // log-in/logout hook
  ON_LOGIN: () => openWs(),
  ON_LOGOUT: () => closeWs()
}
