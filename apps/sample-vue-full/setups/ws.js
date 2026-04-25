import { useAppStore, useMainStore } from '../store.js';

// TODO import { ws } from '@common/vue/plugins/ws.js'
const { VITE_WS_URL } = import.meta.env;

const wsDefaultMsgHandler = e => {
  const appStore = useAppStore();
  console.log('ws onmessage', e.data);
  appStore.message = e.data;
};

export const openWs = (msgHandler = wsDefaultMsgHandler) => {
  if (VITE_WS_URL) {
    // TODO get initial data
    const store = useMainStore();
    // ws.setOptions({ endpoint: `${VITE_WS_URL}/${store.user}` })
    // ws.connect()
    // ws.setMessage(msgHandler)
  }
};

export const closeWs = () => {
  // TODO clear data
  if (VITE_WS_URL) {
    // if (ws) ws.setMessage(null)
    // ws.close()
  }
};
