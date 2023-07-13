import { useMainStore } from '/src/store'
import { useAppStore } from './store.js'
import { ws } from '/src/services.js'
const { VITE_WS_URL } = import.meta.env

const wsMsgHandler = (e) => {
  const appStore = useAppStore()
  console.log('ws onmessage', e.data)
  appStore.message = e.data
}

export const openWs = () => {
  if (VITE_WS_URL) {
    // TBD get initial data
    const store = useMainStore()
    ws.setOptions({ endpoint: `${VITE_WS_URL}/${store.user}` })
    ws.connect()
    ws.setMessage(wsMsgHandler)
  }
}

export const closeWs = () => {
  // TBD clear data
  if (VITE_WS_URL) {
    if (ws) ws.setMessage(null)
    ws.close()
  }
}
