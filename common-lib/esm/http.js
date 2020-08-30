let token = ''
let refreshToken = ''
let baseUrl = 'http://127.0.0.1:3000'
let timeoutMs = 0
let maxRetry = 0

function parseJwt (_token) {
  var base64Url = _token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
  return JSON.parse(jsonPayload)
}

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
  try { // need this here
    const { origin, pathname } = new URL(url) // http://example.com:3001/abc/ees
    urlOrigin = origin
    urlPath = pathname
    urlFull = origin + pathname
  } catch (e) {
  }

  try {
    const controller = new AbortController()
    const signal = controller.signal
    if (timeoutMs > 0) setTimeout(() => controller.abort(), timeoutMs) // err.name === 'AbortError'

    const qs = query ? '?' + Object.keys(query).map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(query[key])).join('&') : ''

    if (!headers) headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    const options = { method, headers }

    if (timeoutMs > 0)  options.signal = signal
    if (token) options.headers['Authorization'] = `Bearer ${token}`  
    if (body) options.body = JSON.stringify(body)

    const rv0 = await fetch(urlFull + qs, options)
    if (rv0.status === 401 && urlPath !== '/api/auth/logout' && urlPath !== '/api/auth/otp' && urlPath !== '/api/auth/refresh') {
      const body0 = await rv0.json()
      if (body0.message === 'Token Expired Error') {
        const rv1 = await http('POST', urlOrigin + '/api/auth/refresh', { refresh_token: refreshToken })
        if (rv1.status === 200) {
          const body1 = await rv1.json()
          token = body1.token
          refreshToken = body1.refresh_token
          if (token) options.headers['Authorization'] = `Bearer ${token}`
          const rv2 = await fetch(urlFull + qs, options)
          return await rv2.json()
        } else {
          console.log('refresh failed')
          return await rv1.json() 
        }
      }
    }
    return await rv0.json() // error
  } catch (e) {
    console.log('http error', e.toString())
    return null
  }
}

async function login() {
  const body = await http('POST', '/api/auth/login', { email: 'test', password: 'test' })
  token = body.token
  refreshToken = body.refresh_token
  console.log('logged in', token, refreshToken, body, parseJwt(token))
}

async function otp() {
  try {
    const body = await http('POST', '/api/auth/otp', { pin: '111111' })
    if (body.token) {
      token = body.token
      refreshToken = body.refresh_token
      console.log('otp ok', token, refreshToken, body)      
    } else {
      console.log('otp error', body)
    }
  } catch (e) {
    console.log('otp', e.toString())
  }
}

const test = () => console.log('https test')

async function testAuth() {
  try {
    const body = await http('GET', '/api/health-auth')
    if (body) console.log('/api/health-auth', body)
    else console.log('get no data', body)
  } catch (e) {
    console.log('get', e.toString())
  }
}

async function logout() {
  try {
    const body = await http('GET', '/api/auth/logout')
    console.log('logout done', body)
  } catch (e) {
    console.log('logout error', e.toString())
  }
}

const httpPost = async (url, body = null, query = null, headers = null) => await http('POST', url, body, query, headers)

const httpPatch = async (url, body = null, query = null, headers = null) => await http('PATCH', url, body, query, headers)

const httpDelete = async (url, query = null, headers = null) => await http('DELETE', url, null, query, headers)

const httpGet = async (url, query = null, headers = null) => await http('GET', url, null, query, headers)

export {
  http,
  httpPost,
  httpGet,
  httpPatch,
  httpDelete,
  test,
  testAuth,
  login,
  otp,
  logout
}
