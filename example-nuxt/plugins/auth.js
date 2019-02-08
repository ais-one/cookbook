export default function({ app }) {
  if (process.server) {
    // app.$auth.$storage.setState('otpVerified', false)
    // console.log('abc', app.$auth.$state)
  } else {
    // console.log('def', app.$auth.$state)
    // app.$suth.strategy()
  }
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
