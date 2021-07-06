import axios from 'axios'
import { store } from '@/store'
import { API_URL, HTTPONLY_TOKEN, WITH_CREDENTIALS, API_REFRESH_URL } from '@/config'

export const http = axios.create({
  withCredentials: WITH_CREDENTIALS,
  // xsrfCookieName: 'csrftoken_testtest',
  // xsrfHeaderName: 'X-CSRFToken', 
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

http.interceptors.request.use((config) => {
  // Do something before request is sent if needed
  return config
}, (error) => {
  // Do something with request error if needed
  return Promise.reject(error)
})

// Add a response interceptor
http.interceptors.response.use(
  (response) => response, // Do something with response data if needed
  (error) => { // Do something with response error
    // console.log('intercept', error.config.url, JSON.stringify(error))
    const myURL = new URL(error.config.baseURL + error.config.url)
    if (error.response && error.response.status === 401) { // auth failed
      if (error.response.data.message === 'Token Expired Error') {
          // console.log('token expired, store', store)
          return http.post(API_REFRESH_URL, { refresh_token: store.state.user.refresh_token }).then(res => {
            // console.log('new token', res.data.token)
            const { access_token, refresh_token } = res.data
            store.commit('setUser', res.data)
            if (!HTTPONLY_TOKEN) {
              error.config.headers.Authorization = `Bearer ${access_token}`
              error.config.headers.refresh_token = refresh_token
            }
            // if (myURL.pathname === '/api/health-auth') console.log('retrying...', error.config, error.config.headers.Authorization) // For Testing Refresh Token
            return http.request(error.config) // http.request(error.config)
          }).catch(function (error2) {
            return Promise.reject(error2)
          })
      } else {
          // error.config.store.dispatch('logout', { forced: true })
          store.dispatch('logout', { forced: true })
          return Promise.reject(error)
      }
    } else {
      return Promise.reject(error)
    }
  }
)

// Vue.prototype.$http = http
