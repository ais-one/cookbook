// FRONTEND ONLY
import parseJwt from './parseJwt.js'

let token = ''
let refreshToken = ''

let baseUrl = '' // 'http://127.0.0.1:3000'
const timeoutMs = 0
const maxRetry = 0
let credentials = 'same-origin'
let forceLogoutFn = () => {} // function to call when forcing a logout

const setBaseUrl = (_baseUrl) => (baseUrl = _baseUrl)
const setToken = (_token) => (token = _token)
const setRefreshToken = (_refreshToken) => (refreshToken = _refreshToken)
const setCredentials = (_credentials) => (credentials = _credentials)
const setForceLogoutFn = (_forceLogoutFn) => (forceLogoutFn = _forceLogoutFn)

// TBD add retry
// https://dev.to/ycmjason/javascript-fetch-retry-upon-failure-3p6g
/*
const fetch_retry = async (url, options, n) => {
    let error;
    for (let i = 0; i < maxRetry; i++) {
        try {
            return await fetch(url, options);
        } catch (err) {
            error = err;
        }
    }
    throw error;
};
*/

const http = async (method, url, body = null, query = null, headers = null) => {
  // settle the URL
  // http://example.com:3001/abc/ees, /abc/ees
  let urlPath = url
  let urlFull = baseUrl + urlPath
  let urlOrigin = baseUrl
  try {
    // need try here
    const { origin, pathname } = new URL(url) // http://example.com:3001/abc/ees
    urlOrigin = origin
    urlPath = pathname
    urlFull = origin + pathname
  } catch (e) {
    // no need to throw anything here
  }

  try {
    const controller = new AbortController()
    const signal = controller.signal
    if (timeoutMs > 0) setTimeout(() => controller.abort(), timeoutMs) // err.name === 'AbortError'

    const qs = query
      ? '?' +
        Object.keys(query)
          .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(query[key]))
          .join('&')
      : ''

    if (!headers) {
      headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    const options = { method, headers }
    if (timeoutMs > 0) options.signal = signal
    if (token && credentials !== 'include') options.headers.Authorization = `Bearer ${token}` // include === HTTPONLY_TOKEN
    if (urlPath === '/api/auth/logout') options.headers.refresh_token = refreshToken // add refresh token for logout
    if (body) options.body = JSON.stringify(body)
    options.credentials = credentials

    const rv0 = await fetch(urlFull + qs, options)
    rv0.data = await rv0.json()
    if (rv0.status >= 200 && rv0.status < 400) return rv0
    else if (rv0.status === 401 && urlPath !== '/api/auth/logout' && urlPath !== '/api/auth/otp' && urlPath !== '/api/auth/refresh') {
      if (rv0.data.message === 'Token Expired Error') {
        const rv1 = await http('POST', urlOrigin + '/api/auth/refresh', { refresh_token: refreshToken }) // rv1 JSON already processed
        if (rv1.status === 200) {
          token = rv1.data.token
          refreshToken = rv1.data.refresh_token
          if (token && credentials !== 'include') options.headers.Authorization = `Bearer ${token}` // include === HTTPONLY_TOKEN
          const rv2 = await fetch(urlFull + qs, options)
          rv2.data = await rv2.json()
          return rv2
        } else {
          // console.log('refresh failed')
          throw rv1 // error
        }
      }
    }
    throw rv0 // error
  } catch (e) {
    if (e && e.data && e.data.message !== 'Token Expired Error' && (e.status === 401 || e.status === 403)) forceLogoutFn()
    throw e // some other error
  }
}

async function login() {
  const { data } = await http('POST', '/api/auth/login', { email: 'test', password: 'test' })
  token = data.token
  refreshToken = data.refresh_token
  console.log('logged in', token, refreshToken, data, parseJwt(token))
}

async function otp() {
  try {
    const { data } = await http('POST', '/api/auth/otp', { pin: '111111' })
    if (data.token) {
      token = data.token
      refreshToken = data.refresh_token
      console.log('otp ok', token, refreshToken, data)
    } else {
      console.log('otp error', data)
    }
  } catch (e) {
    console.log('otp', e.toString())
  }
}

const test = () => console.log('https test')

async function testAuth() {
  try {
    const { data } = await http('GET', '/api/health-auth')
    if (data) console.log('/api/health-auth', data)
    else console.log('get no data', data)
  } catch (e) {
    console.log('get', e)
  }
}

async function logout() {
  try {
    const { data } = await http('GET', '/api/auth/logout')
    console.log('logout done', data)
  } catch (e) {
    console.log('logout error', e)
  }
}

const post = async (url, body = null, query = null, headers = null) => {
  return await http('POST', url, body, query, headers)
  // try {
  //   return await http('POST', url, body, query, headers)
  // } catch (e) {
  //   throw e
  // }
}

const patch = async (url, body = null, query = null, headers = null) => {
  return await http('PATCH', url, body, query, headers)
  // try {
  //   return await http('PATCH', url, body, query, headers)
  // } catch (e) {
  //   throw e
  // }
}

const del = async (url, query = null, headers = null) => {
  return await http('DELETE', url, null, query, headers)
  // try {
  //   return await http('DELETE', url, null, query, headers)
  // } catch (e) {
  //   throw e
  // }
}

const get = async (url, query = null, headers = null) => {
  return await http('GET', url, null, query, headers)
  // try {
  //   return await http('GET', url, null, query, headers)
  // } catch (e) {
  //   throw e
  // }
}

export { http, post, get, patch, del, test, testAuth, login, otp, logout, setBaseUrl, setToken, setRefreshToken, setCredentials, setForceLogoutFn, parseJwt }

// try {
//   let res = await fetch('/api/auth/login', {
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     // mode: 'cors', // no-cors, *cors, same-origin
//     // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     // credentials: 'same-origin', // include, *same-origin, omit
//     headers: {
//       'Content-Type': 'application/json'
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     // redirect: 'follow', // manual, *follow, error
//     // referrer: 'no-referrer', // no-referrer, *client
//     body: JSON.stringify({ email: this.email, password: this.password }) // body data type must match "Content-Type" header
//   })
//   if (res.ok) {
//     let data = await res.json()
//     if (data) {
//       this.$store.commit('setUser', data.user)
//       this.$store.commit('setToken', data.token)
//       localStorage.setItem('ms', JSON.stringify({ user: data.user, token: data.token }))
//       this.$router.push('/dashboard')
//     }
//   } else {
//     this.errorMsg = 'Fail to login'
//   }
//   // dispatch('autoSignIn', rv.data) // token, exchanges && pairs
// } catch (e) {
//   console.log(e.toString())
// }
