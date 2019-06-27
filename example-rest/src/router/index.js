import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  routes: [
    // route level code splitting, components are lazy loaded using import
    { path: '/dashboard', name: 'dashboard', component: () => import('@/pages/Dashboard'), beforeEnter: AuthGuard },
    { path: '/authors', name: 'authors', component: () => import('@/pages/Author'), beforeEnter: AuthGuard },
    { path: '/books', name: 'books', component: () => import('@/pages/Book'), beforeEnter: AuthGuard },
    { path: '/books/:id/pages', name: 'pages', component: () => import('@/pages/Page'), beforeEnter: AuthGuard },
    { path: '/categories', name: 'categories', component: () => import('@/pages/Category'), beforeEnter: AuthGuard },
    { path: '/signup', name: 'SignUp', component: () => import('@/pages/SignUp') },
    { path: '/test', name: 'Test', component: () => import('@/components/Test'), beforeEnter: AuthGuard },
    { path: '/', name: 'SignIn', component: () => import('@/pages/SignIn') },
    { path: '*', redirect: '/' }
  ],
  mode: 'history'
})
