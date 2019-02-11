export default function({ app }) {
  if (process.server) {
    // app.$auth.$storage.setState('otpVerified', false)
    // console.log('abc', app.$auth.$state)
  } else {
    // console.log('def', app.$auth.$state)
    // app.$suth.strategy()
  }
  // console.log('yyyyy', app.$auth)
  // app.$auth.onRedirect(to => {
  //   console.log(to)
  //   // return to
  // })
  // // CUSTOM WATCH LOGGEDIN - DOES NOT WORK
  // // Only _actual_ login/outs (including resets) will be watched here.
  // app.$auth.$storage.watchState('loggedIn', isLoggedIn => {
  //   if (isLoggedIn) {
  //     // Follow @nuxtjs/auth workflow.
  //     // app.$auth.redirect('home')
  //     console.log('LOGGING IN')
  //   } else {
  //     console.log('LOGGING OUT')
  //   }
  // })

  // let token
  // try {
  //   token = app.$auth.$storage.getUniversal('_token.local')
  //   console.log('aa', token) // set token? call to check?
  //   app.$auth.setUser({})
  // } catch (e) {
  //   console.log(e)
  // }
  // if (!token) {
  //   app.$auth.setUser(false)
  // }
  //
  // if (!app.$auth.loggedIn) {
  //   return
  // }
  // const username = app.$auth.user.username
  // console.log('auth plugin', process.server, app.$auth) // fullPathRedirect, 2FA
}
