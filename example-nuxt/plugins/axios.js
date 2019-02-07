export default function({ $axios, app, redirect }) {
  $axios.onRequest(config => {
    console.log('Making request to ' + config.url)
  })
  // onResponse (response)

  // onRequestError, onResponseError
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      // unauthorized
      // sign out user
      app.$auth.setUser(false)
      redirect('/login')
    }
  })
}
