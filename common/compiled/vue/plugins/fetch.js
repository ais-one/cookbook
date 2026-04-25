import Fetch from '@common/iso/fetch';

const { VITE_WITH_CREDENTIALS, VITE_API_URL, VITE_REFRESH_URL } = import.meta.env;
// console.log('plugins/fetch', VITE_API_URL)

export const http = new Fetch({
  baseUrl: VITE_API_URL,
  refreshUrl: VITE_REFRESH_URL, // set as default
  credentials: VITE_WITH_CREDENTIALS || 'same-origin',
});
// export const http2 = new Fetch({ baseUrl: '/api2' })
