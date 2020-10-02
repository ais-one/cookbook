// console.log('fffff', process.env.NODE_ENV, import.meta.env)
export const {
  VITE_API_URL,
  VITE_WS_URL, // ws://127.0.0.1:3001, wss://127.0.0.1:3001
  VITE_WS_MS,
  VITE_GQL_URI,
  VITE_GWS_URI,
  // NOT NEEDED... BACKEND DETERMINES VITE_USE_OTP, // GA, SMS, ''
  VITE_RECAPTCHA_KEY,
  VITE_HTTPONLY_TOKEN = false, // true, false use VITE_HTTPONLY_TOKEN for more security, but needs same domain
  VITE_WITH_CREDENTIALS = 'same-origin', // same-origin, includes = cors

  // VITE_GITHUB_CLIENT_ID
} = import.meta.env

// PAGESIZE: process.env.VUE_APP_PAGESIZE || 4,
// PAGESIZE_OPTS: process.env.VUE_APP_PAGESIZE_OPTS && process.env.VUE_APP_PAGESIZE_OPTS.length ? JSON.parse(process.env.VUE_APP_PAGESIZE_OPTS) : [4, 8, 10],
// APP_VERSION: '0.4.1',

