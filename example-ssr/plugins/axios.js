/*
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
*/

import axios from 'axios'
import { store } from '@/store'
import { API_URL, HTTPONLY_TOKEN, SAME_ORIGIN } from '@/config'

export const http = axios.create({
  withCredentials: SAME_ORIGIN ? false : true,
  // withCredentials: true,
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
  // config.store = store
  return config
}, (error) => {
  // Do something with request error if needed
  return Promise.reject(error)
})

// Add a response interceptor
http.interceptors.response.use((response) => {
  // Do something with response data if needed
  return response
}, (error) => {
  // Do something with response error
  // console.log('intercept', JSON.stringify(error))
  const myURL = new URL(error.config.url)
  if (error.response && error.response.status === 401) { // auth failed
    if (myURL.pathname !== '/api/auth/logout' && myURL.pathname !== '/api/auth/otp') {
      if (error.response.data.message === 'Token Expired Error') {
        // console.log('token expired, store', store)
        return http.post('/api/auth/refresh', { refresh_token: store.getters.user.refresh_token }).then(res => {
          // console.log('new token', res.data.token)
          const { token } = res.data
          store.commit('setUser', res.data)
          if (!HTTPONLY_TOKEN) error.config.headers['Authorization'] = 'Bearer ' + token // need to set this also...
          if (myURL.pathname === '/api/authors' || myURL.pathname === '/api/auth/me') {
            console.log('retyring...', error.config)
          }
          return http.request(error.config) // http.request(error.config)
        }).catch(function (error) {
          return Promise.reject(error)
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
})
