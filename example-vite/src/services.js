import { VITE_API_URL, VITE_WITH_CREDENTIALS, VITE_REFRESH_URL } from '/config.js'
import Fetch from '/@es-labs/esm/fetch.js'

export const http = new Fetch({
  baseUrl: VITE_API_URL,
  refreshUrl: VITE_REFRESH_URL,
  credentials: VITE_WITH_CREDENTIALS || 'same-origin'
})
// export const http2 = new Fetch({ baseUrl: '/api2' })
