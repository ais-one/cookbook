import { VITE_API_URL, VITE_WITH_CREDENTIALS, VITE_REFRESH_URL, VITE_WS_URL, VITE_WS_MS } from '/config.js'
import Fetch from '/@es-labs/esm/fetch.js'
import Ws from '/@es-labs/esm/ws.js'

export const http = new Fetch({
  baseUrl: VITE_API_URL,
  refreshUrl: VITE_REFRESH_URL, // set as default
  credentials: VITE_WITH_CREDENTIALS || 'same-origin'
})
// export const http2 = new Fetch({ baseUrl: '/api2' })

export const ws = new Ws({ endpoint: VITE_WS_URL, reconnectMs: VITE_WS_MS }) // ws.setOptions()
