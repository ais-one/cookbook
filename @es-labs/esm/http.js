// FRONTEND ONLY
// TBD make this such that can use default instance or create new instance
// refresh API URL

let opts = {
  baseUrl: '',
  credentials: 'same-origin',
  forceLogoutFn: () => {}, // function to call when forcing a logout
  refreshUrl: '',
  timeoutMs: 0,
  maxRetry: 0
}

let tokens = { access: '', refresh: '' }

const setOptions = (_options) => Object.assign(opts, _options)
const setTokens = (_tokens) => Object.assign(tokens, _tokens)

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

const parseUrl = (url) => {
  let urlPath = url
  let urlOrigin = opts.baseUrl
  let urlFull = opts.baseUrl + urlPath
  let urlSearch = ''
  try {
    urlSearch = (url.lastIndexOf('?') !== -1) ? url.split('?').pop() : '' // handle /abc/def?aa=1&bb=2
    if (urlSearch) urlSearch = '?' + urlSearch // prepend ?
    const { origin = '', pathname = '', search = '' } = new URL(url) // http://example.com:3001/abc/ees?aa=1&bb=2
    urlOrigin = origin
    urlPath = pathname
    urlFull = origin + pathname
    urlSearch = search
  } catch (e) {
  }
  return { urlOrigin, urlPath, urlFull, urlSearch }
}

// fetch() options, * is default setting
// method: *GET, POST, PUT, DELETE, etc.
// mode: no-cors, *cors, same-origin
// cache: *default, no-cache, reload, force-cache, only-if-cached
// credentials: include, *same-origin, omit
// headers: // Content-Type, etc
// redirect: manual, *follow, error
// referrer: no-referrer, *client
// body: JSON.stringify({  }), FormData, File... // body data type must match "Content-Type" header
const http = async (method, url, body = null, query = null, headers = null) => {
  const { urlOrigin, urlPath, urlFull, urlSearch } = parseUrl(url)
  try {
    const controller = new AbortController()
    const signal = controller.signal
    if (opts.timeoutMs > 0) setTimeout(() => controller.abort(), opts.timeoutMs) // err.name === 'AbortError'

    let qs = (query && typeof query === 'object') // null is also an object
      ? '?' +
        Object.keys(query).map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(query[key])).join('&')
      : (query || '')
    qs = qs ? qs + urlSearch.substring(1) // remove the question mark
      : urlSearch

    if (!headers) {
      headers = {
        Accept: 'application/json'
      }
    }
    const options = { method, headers }
    if (opts.timeoutMs > 0) options.signal = signal
    if (opts.credentials !== 'include') { // include === HTTPONLY_TOKEN
      if (tokens.access) options.headers.access_token = tokens.access
      if (tokens.refresh) options.headers.refresh_token = tokens.refresh
    }
    options.credentials = opts.credentials

    if (['POST', 'PATCH', 'PUT'].includes(method)) { // check if HTTP method has req body (DELETE is maybe)
      if (body && body instanceof FormData) {
        // options.headers['Content-Type'] = 'multipart/form-data' // NOT NEEDED!!!
        options.body = body
      } else if (options.headers['Content-Type'] && options.headers['Content-Type'] === 'application/octet-stream') {
        // handling stream...
        options.body = body
      } else {
        options.headers['Content-Type'] = 'application/json' // NEEDED!!!
        options.body = JSON.stringify(body)
      }  
    }

    const rv0 = await fetch(urlFull + qs, options)
    // rv0.data = await rv0.json() // replaced by below to handle empty body
    const txt0 = await rv0.text()
    rv0.data = txt0.length ? JSON.parse(txt0) : {}
    if (rv0.status >= 200 && rv0.status < 400) return rv0
    else if (rv0.status === 401) { // no longer needed urlPath !== '/api/auth/refresh'
      if (rv0.data.message === 'Token Expired Error') {
        const rv1 = await http('POST', urlOrigin + opts.refreshUrl, { refresh_token: tokens.refresh }) // rv1 JSON already processed
        if (rv1.status === 200) {
          tokens.access = rv1.data.access_token
          tokens.refresh = rv1.data.refresh_token
          if (options.credentials !== 'include') { // include === HTTPONLY_TOKEN
            if (tokens.access) options.headers.access_token = tokens.access
            if (tokens.refresh) options.headers.refresh_token = tokens.refresh
          }
          const rv2 = await fetch(urlFull + qs, options)
          // rv2.data = await rv2.json() // replaced by below to handle empty body
          const txt2 = await rv2.text()
          rv2.data = txt2.length ? JSON.parse(txt2) : {}
          return rv2
        } else {
          // console.log('refresh failed')
          throw rv1 // error
        }
      }
    }
    throw rv0 // error
  } catch (e) {
    // some errors are due to res.json(), should be res.json({})
    if (e?.data?.message !== 'Token Expired Error' && (e.status === 401 || e.status === 403)) opts.forceLogoutFn()
    throw e // some other error
  }
}

const post = async (url, body = null, query = null, headers = null) => await http('POST', url, body, query, headers)
const put = async (url, body = null, query = null, headers = null) => await http('PUT', url, body, query, headers)
const patch = async (url, body = null, query = null, headers = null) => await http('PATCH', url, body, query, headers)
const del = async (url, query = null, headers = null) => await http('DELETE', url, null, query, headers)
const get = async (url, query = null, headers = null) => await http('GET', url, null, query, headers)

export {
  http,
  post,
  get,
  put,
  patch,
  del,
  parseUrl,
  setOptions,
  setTokens
}

// var global = window || global
// global.Validator = Validator
