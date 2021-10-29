// TBD add retry - https://dev.to/ycmjason/javascript-fetch-retry-upon-failure-3p6g

class Fetch {
  constructor(options = {}, tokens = {}) {
    this.options = {
      baseUrl: '',
      credentials: 'same-origin',
      forceLogoutFn: () => {}, // function to call when forcing a logout
      refreshUrl: '',
      timeoutMs: 0,
      maxRetry: 0
    }
    Object.assign(this.options, options)
    this.tokens = { access: '', refresh: '' }
    Object.assign(this.tokens, tokens)
  }

  static parseUrl (url, baseUrl = '') {
    let urlPath = url
    let urlOrigin = baseUrl
    let urlFull = baseUrl + urlPath
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
  
  setOptions (options) { Object.assign(this.options, options) }
  getOptions () { return this.options }

  setTokens (tokens) { Object.assign(this.tokens, tokens) }
  getTokens () { return this.tokens }

  async http (method, url, body = null, query = null, headers = null) {
    const { urlOrigin, urlPath, urlFull, urlSearch } = Fetch.parseUrl(url, this.options.baseUrl)
    try {
      const controller = new AbortController()
      const signal = controller.signal
      if (this.options.timeoutMs > 0) setTimeout(() => controller.abort(), this.options.timeoutMs) // err.name === 'AbortError'
  
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
      if (this.options.timeoutMs > 0) options.signal = signal
      if (this.options.credentials !== 'include') { // include === HTTPONLY_TOKEN
        if (this.tokens.access) options.headers.Authorization = `Bearer ${this.tokens.access}`
      }
      options.credentials = this.options.credentials
  
      if (['POST', 'PATCH', 'PUT'].includes(method)) { // check if HTTP method has req body (DELETE is maybe)
        if (body && body instanceof FormData) {
          options.body = body // options.headers['Content-Type'] = 'multipart/form-data' // NOT NEEDED!!!
        } else if (options.headers['Content-Type'] && options.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
          options.body = new URLSearchParams(body) // body should be JSON
        } else if (options.headers['Content-Type'] && options.headers['Content-Type'] === 'application/octet-stream') {
          options.body = body // handling stream...
        } else {
          options.headers['Content-Type'] = 'application/json' // NEEDED!!!
          options.body = JSON.stringify(body)
        }  
      }
  
      const rv0 = await fetch(urlFull + qs, options)
      const txt0 = await rv0.text() // handle empty body as xxx.json() cannot
      rv0.data = txt0.length ? JSON.parse(txt0) : {}
      if (rv0.status >= 200 && rv0.status < 400) return rv0
      else if (rv0.status === 401) { // no longer needed urlPath !== '/api/auth/refresh'
        if (rv0.data.message === 'Token Expired Error' && this.options.refreshUrl) {
          const rv1 = await this.http('POST', urlOrigin + this.options.refreshUrl, { refresh_token: this.tokens.refresh }) // rv1 JSON already processed
          if (rv1.status === 200) {
            this.tokens.access = rv1.data.access_token
            this.tokens.refresh = rv1.data.refresh_token
            if (options.credentials !== 'include') { // include === HTTPONLY_TOKEN
              if (this.tokens.access) options.headers.Authorization = `Bearer ${this.tokens.access}`
            }
            const rv2 = await fetch(urlFull + qs, options)
            const txt2 = await rv2.text()
            rv2.data = txt2.length ? JSON.parse(txt2) : {}
            return rv2
          } else {
            throw rv1 // error
          }
        }
      }
      throw rv0 // error
    } catch (e) {
      if (e?.data?.message !== 'Token Expired Error' && (e.status === 401 || e.status === 403)) this.options.forceLogoutFn()
      throw e // some other error
    }
  }
  
  async post (url, body = null, query = null, headers = null) { return this.http('POST', url, body, query, headers) }
  async put (url, body = null, query = null, headers = null) { return this.http('PUT', url, body, query, headers) }
  async patch (url, body = null, query = null, headers = null) { return this.http('PATCH', url, body, query, headers) }
  async del (url, query = null, headers = null) { return this.http('DELETE', url, null, query, headers) }
  async get (url, query = null, headers = null) { return this.http('GET', url, null, query, headers) }
}

export default Fetch
