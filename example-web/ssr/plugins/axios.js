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

import Vue from 'vue'
import axios from 'axios'
import { API_URL, HTTPONLY_TOKEN, WITH_CREDENTIALS } from '@/config'

export const http = axios.create({
  // See https://github.com/nuxt-community/axios-module#options
  // cannot use proxy for nuxt generated
  // proxy: true
  // xsrfCookieName: 'csrftoken_testtest',
  // xsrfHeaderName: 'X-CSRFToken', 
  withCredentials: WITH_CREDENTIALS,
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

export default ({ app, store }) => {
  http.interceptors.request.use((config) => {
    // Do something before request is sent if needed
    // console.log('$nuxt', $nuxt)
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
          return http.post('/api/auth/refresh', { refresh_token: store.state.user.refresh_token }).then(res => {
            // console.log('refresh', res.data.token, error.config.headers)
            const { token } = res.data
            store.commit('setUser', res.data)
            if (!HTTPONLY_TOKEN) error.config.headers['Authorization'] = 'Bearer ' + token // need to set this also...
            if (myURL.pathname === '/api/authors' || myURL.pathname === '/api/auth/me') {
              // console.log('retyring...', error.config)
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

  Vue.prototype.$http = http
}
