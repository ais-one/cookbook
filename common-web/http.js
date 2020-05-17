const http = async (method, url, body = null, query = null) => {
  const qs = query ? '?' + Object.keys(query).map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(query[key])).join('&') : ''
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }
  if (window.store && window.store.jwt) options.headers['Authorization'] = `Bearer ${window.store.jwt}`
  if (body) options.body = JSON.stringify(body)

  return await fetch(url + qs, options)
}

const post = async (url, body = null, query = null) => {
  return await http('POST', url, body, query)
}

const update = async (url, body = null, query = null) => {
  return await http('PATCH', url, body, query)
}

const remove = async (url, query = null) => {
  return await http('DELETE', url, null, query)
}

const find = async (url, query = null) => {
  return await http('GET', url, null, query)
}

const create = post 

export default {
  post,
  create,
  update,
  remove,
  find
}
