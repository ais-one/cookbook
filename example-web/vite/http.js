let token = ''
let refreshToken = ''
let baseUrl = 'http://127.0.0.1:3000'

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const http = async (method, url, body = null, query = null) => {
  // settle the URL
  // http://example.com:3001/abc/ees, /abc/ees
  let urlPath = url
  let urlFull = baseUrl + urlPath
  let urlOrigin = baseUrl
  try {
    const { origin, pathname } = new URL(url) // http://example.com:3001/abc/ees
    urlOrigin = origin
    urlPath = pathname
    urlFull = origin + pathname
  } catch (e) {
    // console.log('URL parse', e.message)
  }
  try {
    const qs = query ? '?' + Object.keys(query).map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(query[key])).join('&') : ''
    console.log('qqq', query, qs)
    const options = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }

    if (token) options.headers['Authorization'] = `Bearer ${token}`
    if (body) options.body = JSON.stringify(body)
    // console.log(options)
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
  const rv = await http('POST', '/api/auth/login', { email: 'test', password: 'test' })
  console.log(rv) // rv.ok
  const body = await rv.json()
  token = body.token
  refreshToken = body.refresh_token
  console.log('logged in', token, refreshToken, body, parseJwt(token))
}

async function otp() {
  try {
    const rv = await http('POST', '/api/auth/otp', { pin: '111111' })
    if (rv.ok) {
      const body = await rv.json()
      token = body.token
      refreshToken = body.refresh_token
      console.log('otp in', token, refreshToken, body)      
    } else {
      console.log('otp in error', rv)
    }
  } catch (e) {
    console.log('otp', e.toString())
  }
}

async function get() {
  try {
    const rv = await http('GET', '/api/health-auth')
    if (rv && rv.ok) {
      const data = await rv.json()
      console.log('/api/health-auth', data)
    } else {
      console.log('get no data', rv)
    }
  } catch (e) {
    console.log('get', e.toString())
  }
}

async function logout() {
  try {
    const rv = await http('GET', '/api/auth/logout')
    if (rv.ok) {
      console.log('logout ok')      
    } else {
      console.log('logout fail')
    }
  } catch (e) {
    console.log('logout error', e.toString())
  }
}

const post = async (url, body = null, query = null) => await http('POST', url, body, query)

const update = async (url, body = null, query = null) => await http('PATCH', url, body, query)

const remove = async (url, query = null) => await http('DELETE', url, null, query)

const find = async (url, query = null) => await http('GET', url, null, query)

const create = post 

const test = () => {
  console.log('https test')  
}

export {
  http,
  login,
  otp,
  logout,
  update,
  remove,
  find,
  create,
  test,
}
