export default function({ $axios, app, redirect }) {
  $axios.onRequest(config => {
    // const token = app.$auth.getToken('local')
    // if (token) {
    //   config.headers['Authorization'] = token
    // }
    // console.log('Making request to ' + config.url)
  })
  // onResponse (response)

  // onRequestError, onResponseError
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      // unauthorized - sign out user & redirect done by auth module, default to /login route
      app.$auth.setUser(false)
      // Do not redirect below as auth module knows what to do after you set user as false
      // redirect('/login')
    }
  })
}
