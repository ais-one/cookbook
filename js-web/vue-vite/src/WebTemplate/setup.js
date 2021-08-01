// import { openWs, closeWs } from './hookFns.js'

// :key="$route.fullPath" // this is causing problems
import layoutPublic from './layouts/Public.vue'
import layoutSecure from './layouts/Secure.vue'

export default {
  LAYOUTS: {
    layoutPublic,
    layoutSecure
  },
  ROUTES: [
    // { path: '/:catchAll(.*)', name: 'catchAll', redirect: { name: 'SignIn' }, meta: { requiresAuth: false, layout: 'layout-public' } },
    { path: '/forbidden', name: 'Forbidden', component: () => import('./views/Forbidden.vue') },
    { path: '/:catchAll(.*)', name: 'NotFound', component: () => import('./views/NotFound.vue') }
  ],
  PUBLIC_ROUTES: [
    { path: '/', name: 'Home', component: () => import('./views/SignIn.vue') },
    { path: '/signin', name: 'SignIn', component: () => import('./views/SignIn.vue') },
    { path: '/signin-fast', name: 'SignInFast', component: () => import('./views/SignInFast.vue') },
    { path: '/callback', name: 'Callback', component: () => import('./views/Callback.vue') }
  ],
  SECURE_ROUTES: [
    { path: '/dashboard', name: 'Dashboard', component: async () => await import('./Dashboard.vue') },

    { path: '/demo/web-cam', name: 'Demo Web Cam', component: () => import('./Demo/DemoWebCam.vue') },
    { path: '/demo/sign-pad', name: 'Demo Sign Pad', component: async () => import('./Demo/DemoSignPad.vue') },
    { path: '/demo/table', name: 'DemoTable', component: async () => import('./Demo/DemoTable.vue') },
    { path: '/demo/chart', name: 'Demo Chart', component: () => import('./Demo/DemoChart.vue') },
    { path: '/demo/map', name: 'Demo Map', component: () => import('./Demo/DemoMap.vue') },
    { path: '/demo/main', name: 'DemoMain', component: () => import('./Demo/DemoMain.vue') },

    { path: '/visuals/chart1', name: 'DemoChart1', component: async () => import('./Visuals/DemoChart1.vue') },
    { path: '/visuals/chart2', name: 'DemoChart2', component: async () => import('./Visuals/DemoChart2.vue') },
    { path: '/visuals/antd-map', name: 'DemoMap', component: async () => import('./Visuals/DemoMap.vue') },

    { path: '/data-entry/form', name: 'DemoForm', component: async () => import('./DataEntry/DemoForm.vue') },
    { path: '/data-entry/card', name: 'DemoCard', component: async () => import('./DataEntry/DemoCard.vue') },
    { path: '/data-entry/cascade-ms', name: 'CascadeMs', component: async () => import('./DataEntry/CascadeMs.vue') }
  ],
  INITIAL_PUBLIC_PATH: '/signin',
  INITIAL_SECURE_PATH: '/dashboard',

  VERSION: '0.0.2'
}
