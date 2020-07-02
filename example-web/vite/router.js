
import { createRouter, createWebHistory } from 'vue-router'
// import { createRouter, createWebHistory } from 'vue-router/dist/vue-router.esm-bundler.js'

// import AuthGuard from './auth-guard'
const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    // { path: '/', name: 'Home', component: Home },
    // { path: '/site-b', name: 'SiteB', component: SiteB },
    // { path: '/site-a', name: 'SiteA', component: SiteA },

    { path: '/site-b', name: 'SiteB', component: () => import('./SiteB.vue') },
    { path: '/site-a', name: 'SiteA', component: () => import('./SiteA.vue') },
    { path: '/', name: 'Home', component: () => import('./Home.vue') },
    // { path: '*', redirect: '/' } // need to change to catchAll...
    // { path: '/:catchAll(.*)', redirect: '/' }    
  ]
})

export default router
