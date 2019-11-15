import axios from 'axios'
import { store } from './store'
// import jwtDecode from 'jwt-decode'
import { API_URL } from '@/config'

export const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

http.interceptors.request.use((config) => {
  // Do something before request is sent if needed
  config.store = store
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
    if (error.response.data.message === 'TokenExpiredError' && myURL.pathname !== '/api/auth/logout') {
      // console.log('token expired')
      http.post('/api/auth/refresh').then(res => {
        console.log('aassd', res.data.token)
        const { token } = res.data
        store.commit('setUser', res.data) // http.defaults.headers.common['Authorization'] = 'Bearer ' + token
        error.config.headers['Authorization'] = 'Bearer ' + token
        return http.request(error.config)
      }).catch(function (error) {
        return Promise.reject(error)
      })
    } else {
      if (myURL.pathname !== '/api/auth/logout' && myURL.pathname !== '/api/auth/otp') {
        error.config.store.dispatch('logout', { forced: true })
      }  
    }
  }
  return Promise.reject(error)
})
