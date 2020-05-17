// import Vue from 'vue'
import axios from 'axios'
import { store } from '@/store'
// import jwtDecode from 'jwt-decode'
import { API_URL, HTTPONLY_TOKEN, WITH_CREDENTIALS } from '@/config'

// jQuery 1.5.1 xhrFields: {withCredentials: true}
// ES6 fetch() credentials: 'include'
// axios: withCredentials: true

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
      if (myURL.pathname !== '/api/auth/logout' && myURL.pathname !== '/api/auth/otp') {
        if (error.response.data.message === 'Token Expired Error') {
          // console.log('token expired, store', store)
          return http.post('/api/auth/refresh', { refresh_token: store.state.user.refresh_token }).then(res => {
            // console.log('new token', res.data.token)
            const { token } = res.data
            store.commit('setUser', res.data)
            if (!HTTPONLY_TOKEN) error.config.headers['Authorization'] = 'Bearer ' + token // need to set this also...
            if (myURL.pathname === '/api/authors' || myURL.pathname === '/api/auth/me') { // For Testing Refresh Token
              // console.log('retrying...', error.config, error.config.headers.Authorization)
            }
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
    } else {
      return Promise.reject(error)
    }
  }
)

// Vue.prototype.$http = http
