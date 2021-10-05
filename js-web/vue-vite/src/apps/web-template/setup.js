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
    // you can change this to your custom views for Not Found and Forbidden view
    // { path: '/:catchAll(.*)', name: 'catchAll', redirect: { name: 'SignIn' }, meta: { requiresAuth: false, layout: 'layout-public' } },
    { path: '/forbidden', name: 'Forbidden', component: () => import('../../views/Forbidden.vue') },
    { path: '/:catchAll(.*)', name: 'NotFound', component: () => import('../../views/NotFound.vue') }
  ],
  PUBLIC_ROUTES: [
    { path: '/', name: 'Home', component: () => import('./views/SignIn.vue') },
    { path: '/signin', name: 'SignIn', component: () => import('./views/SignIn.vue') },
    { path: '/signin-fast', name: 'SignInFast', component: () => import('./views/SignInFast.vue') },
    { path: '/callback', name: 'Callback', component: () => import('./views/Callback.vue') }
  ],
  SECURE_ROUTES: [
    { path: '/dashboard', name: 'Dashboard', component: async () => import('./views/Dashboard.vue') },
    { path: '/demo/test', name: 'Demo Test', component: async () => import('./views/Demo/DemoTest.vue') },
    { path: '/demo/web-cam', name: 'Demo Web Cam', component: () => import('./views/Demo/DemoWebCam.vue') },
    { path: '/demo/sign-pad', name: 'Demo Sign Pad', component: async () => import('./views/Demo/DemoSignPad.vue') },
    { path: '/demo/table', name: 'DemoTable', component: async () => import('./views/Demo/DemoTable.vue') },
    { path: '/demo/chart', name: 'Demo Chart', component: () => import('./views/Demo/DemoChart.vue') },
    { path: '/demo/map', name: 'Demo Map', component: () => import('./views/Demo/DemoMap.vue') },
    { path: '/demo/main', name: 'Demo Main', component: () => import('./views/Demo/DemoMain.vue') },
    { path: '/visuals/chart1', name: 'DemoChart1', component: async () => import('./views/Visuals/DemoChart1.vue') },
    { path: '/visuals/chart2', name: 'DemoChart2', component: async () => import('./views/Visuals/DemoChart2.vue') },
    { path: '/visuals/antd-map', name: 'DemoMap', component: async () => import('./views/Visuals/DemoMap.vue') },
    { path: '/data-entry/form', name: 'DemoForm', component: async () => import('./views/DataEntry/DemoForm.vue') },
    { path: '/data-entry/card', name: 'DemoCard', component: async () => import('./views/DataEntry/DemoCard.vue') },
    { path: '/data-entry/cascade-ms', name: 'CascadeMs', component: async () => import('./views/DataEntry/CascadeMs.vue') },

    // demo2
    { path: '/demo2/cnn', name: 'Demo2 Cnn', component: async () => import('./views/Demo2/DemoCnn.vue') },
    { path: '/demo2/table', name: 'Demo2 Table', component: async () => import('./views/Demo2/DemoTable.vue') },
    { path: '/demo2/tableapi', name: 'Demo2 Table API', component: async () => import('./views/Demo2/DemoTableApi.vue') },
    { path: '/demo2/cascade', name: 'Demo2 Cascade', component: async () => import('./views/Demo2/Cascade.vue') },
    { path: '/demo2/form', name: 'Demo2 Form', component: async () => import('./views/Demo2/DemoForm.vue') },
    { path: '/demo2/card', name: 'Demo2 Card', component: async () => import('./views/Demo2/DemoCard.vue') },
    { path: '/demo2/map', name: 'Demo2 Map', component: async () => import('./views/Demo2/DemoMap.vue') },
    { path: '/demo2/chart1', name: 'Demo2 Chart1', component: async () => import('./views/Demo2/DemoChart1.vue') },
    { path: '/demo2/chart2', name: 'Demo2 Chart2', component: async () => import('./views/Demo2/DemoChart2.vue') },
    { path: '/demo2/graph', name: 'Demo2 Graph', component: async () => import('./views/Demo2/DemoGraph.vue') },
    { path: '/demo2/more-forms', name: 'Demo2 More Forms', component: async () => import('./views/Demo2/DemoMoreForms.vue') },
    { path: '/demo2/api-forms', name: 'Demo2 Forms (API) FAVV', component: async () => import('./views/Demo2/DemoApiForms.vue') }
  ],
  INITIAL_PUBLIC_PATH: '/signin',
  INITIAL_SECURE_PATH: '/dashboard',

  // log-in/logout hook
  ON_LOGIN: () => openWs(),
  ON_LOGOUT: () => closeWs(),

  VERSION: '0.0.3'
}
