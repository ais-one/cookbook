import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  routes: [
    // route level code splitting, components are lazy loaded using import
    { path: '/callback', name: 'callback', component: () => import('@/pages/Callback') },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/pages/Dashboard'), beforeEnter: AuthGuard },
    { path: '/authors', name: 'authors', component: () => import('@/pages/Author'), beforeEnter: AuthGuard },
    { path: '/books', name: 'books', component: () => import('@/pages/Book'), beforeEnter: AuthGuard },
    { path: '/books/:id/pages', name: 'pages', component: () => import('@/pages/Page'), beforeEnter: AuthGuard },
    { path: '/categories', name: 'categories', component: () => import('@/pages/Category'), beforeEnter: AuthGuard },
    { path: '/signup', name: 'SignUp', component: () => import('@/pages/SignUp') },
    { path: '/test', name: 'test', component: () => import('@/components/Test'), beforeEnter: AuthGuard },
    { path: '/mongo-test', name: 'mongo-test', component: () => import('@/pages/MongoTest'), beforeEnter: AuthGuard },
    { path: '/firebase-rt', name: 'firebase-rt', component: () => import('@/pages/FirebaseRt'), beforeEnter: AuthGuard },
    { path: '/firebase-storage', name: 'firebase-storage', component: () => import('@/pages/FirebaseStorage'), beforeEnter: AuthGuard },
    { path: '/', name: 'SignIn', component: () => import('@/pages/SignIn') },
    { path: '*', redirect: '/' }
  ],
  mode: 'history'
})
