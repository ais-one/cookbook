import router from "../../example-spa/src/router"

const permissions = {
  'all': ['/test', '/dashboard'],
  'rest': ['/authors', '/categories', '/books', '/pages', '/books/:id/pages'],
  'mongo': ['/mongo-test'],
  'firebase': ['/firebase-rt', '/firebase-storage']
}

// export default (to, from, next) => {
// }

export default ({ app, store }) => {
    // Every time the route changes (fired on initialization too)
    // app.router.beforeEnter((to, from, next) => {
    // })
    if (!store.state.user && store.getters.user.verified) {
      const { loginType } = store.getters.user
      let idx = -1
      if (permissions[loginType]) idx = permissions[loginType].indexOf(to.matched[0].path)
      if (idx === -1) idx = permissions['all'].indexOf(to.matched[0].path) // try again
      if (idx === -1) { // Forbidden
        alert('Forbidden... Check Page Permissions')
        app.router.push('/')
      }
      // return redirect('/login')
    } else {
      const item = localStorage.getItem('session') // survive a refresh - POTENTIAL SECURITY RISK - TO REVIEW AND CHANGE USE HTTPONLY COOKIES
      if (item) {
        const user = JSON.parse(item)
        if (user.verified) {
          store.commit('setUser', user) // need user.token only
          store.commit('setLayout', 'layout-admin')
        }
      }
      app.router.push('/')
    }
  }