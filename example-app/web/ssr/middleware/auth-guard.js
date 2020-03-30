export default ({ app, route, store }) => {
  if (!process.browser) return
  // console.log('auth-guard', store.state.user.verified)
  const matchedPath = route.matched[0].path
  if (store.state.user && store.state.user.verified) {
    // return redirect('/login')
  } else {
    const item = window.localStorage.getItem('session') // survive a refresh - POTENTIAL SECURITY RISK - CHANGE TO USE HTTPONLY COOKIES
    if (item) {
      const user = JSON.parse(item)
      if (user.verified) {
        store.commit('setUser', user) // need user.token only
        // store.commit('setLayout', 'layout-admin')
      }
    }
    app.router.push('/')
  }
}