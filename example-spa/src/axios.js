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

/*
axios.interceptors.request.use((config) => {
  let originalRequest = config
  if (helper.isTokenExpired(this.$store.getters.tokenInfo)) {
    return this.refreshToken(this.$store.getters.jwt).then((response) => {
      localStorage.setItem('token', response.data.token)
      originalRequest.headers.Authorization = response.data.token
      return Promise.resolve(originalRequest)
    })
  }
  return config
}, (err) => {
  return Promise.reject(err)
})

  refreshToken (token) {
      const payload = {
        token: token
      }
      const headers = {
        'Content-Type': 'application/json'
      }
      return new Promise((resolve, reject) => {
        return AXIOS.post('/api/auth/token/refresh/', payload, { headers: headers }).then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }
*/
http.interceptors.request.use((config) => {
  // Do something before request is sent
  config.store = store
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
http.interceptors.response.use((response) => {
  // Do something with response data
  /* handle refresh token example
  if (response.headers['refresh-token]) {
    const token = response.headers['refresh-token]
    const payload = jwtDecode(token)
    axios.defaults.headers.common['Authorizerion'] = 'Bearer ' + token
    localStorage.setItem('session-token', token)
  }
  */
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
        const token = res.data.token
        http.defaults.headers.common['Authorization'] = 'Bearer ' + token
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
