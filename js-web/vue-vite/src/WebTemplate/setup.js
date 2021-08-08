// import { openWs, closeWs } from './hookFns.js'

// :key="$route.fullPath" // this is causing problems
import layoutPublic from '../layouts/Public.vue' // you can change this to your own layout
import layoutSecure from '../layouts/Secure.vue' // as above

export default {
  LAYOUTS: {
    layoutPublic,
    layoutSecure
  },
  ROUTES: [
    // you can change this to your custom views for Not Found and Forbidden view
    // { path: '/:catchAll(.*)', name: 'catchAll', redirect: { name: 'SignIn' }, meta: { requiresAuth: false, layout: 'layout-public' } },
    { path: '/forbidden', name: 'Forbidden', component: () => import('../views/Forbidden.vue') },
    { path: '/:catchAll(.*)', name: 'NotFound', component: () => import('../views/NotFound.vue') }
  ],
  PUBLIC_ROUTES: [
    { path: '/', name: 'Home', component: () => import('./Views/SignIn.vue') },
    { path: '/signin', name: 'SignIn', component: () => import('./Views/SignIn.vue') },
    { path: '/signin-fast', name: 'SignInFast', component: () => import('./Views/SignInFast.vue') },
    { path: '/callback', name: 'Callback', component: () => import('./Views/Callback.vue') }
  ],
  SECURE_ROUTES: [
    { path: '/dashboard', name: 'Dashboard', component: async () => await import('./Views/Dashboard.vue') },

    { path: '/demo/web-cam', name: 'Demo Web Cam', component: () => import('./Views/Demo/DemoWebCam.vue') },
    { path: '/demo/sign-pad', name: 'Demo Sign Pad', component: async () => import('./Views/Demo/DemoSignPad.vue') },
    { path: '/demo/table', name: 'DemoTable', component: async () => import('./Views/Demo/DemoTable.vue') },
    { path: '/demo/chart', name: 'Demo Chart', component: () => import('./Views/Demo/DemoChart.vue') },
    { path: '/demo/map', name: 'Demo Map', component: () => import('./Views/Demo/DemoMap.vue') },
    { path: '/demo/main', name: 'DemoMain', component: () => import('./Views/Demo/DemoMain.vue') },

    { path: '/visuals/chart1', name: 'DemoChart1', component: async () => import('./Views/Visuals/DemoChart1.vue') },
    { path: '/visuals/chart2', name: 'DemoChart2', component: async () => import('./Views/Visuals/DemoChart2.vue') },
    { path: '/visuals/antd-map', name: 'DemoMap', component: async () => import('./Views/Visuals/DemoMap.vue') },

    { path: '/data-entry/form', name: 'DemoForm', component: async () => import('./Views/DataEntry/DemoForm.vue') },
    { path: '/data-entry/card', name: 'DemoCard', component: async () => import('./Views/DataEntry/DemoCard.vue') },
    { path: '/data-entry/cascade-ms', name: 'CascadeMs', component: async () => import('./Views/DataEntry/CascadeMs.vue') }
  ],
  INITIAL_PUBLIC_PATH: '/signin',
  INITIAL_SECURE_PATH: '/dashboard',

  VERSION: '0.0.2'
}
