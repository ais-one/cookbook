// console.log('fffff', process.env.NODE_ENV, import.meta.env)
export const {
  VITE_API_URL,
  VITE_WS_URL, // ws://127.0.0.1:3001, wss://127.0.0.1:3001
  VITE_USE_OTP, // GA, SMS, ''
  VITE_RECAPTCHA_KEY,
  // HTTPONLY_TOKEN: false, // true, false use HTTPONLY_TOKEN for more security, but needs same domain
  // WITH_CREDENTIALS: false, // true = use same origin, false = cors  
  // VITE_GITHUB_CLIENT_ID
} = import.meta.env

// PAGESIZE: process.env.VUE_APP_PAGESIZE || 4,
// PAGESIZE_OPTS: process.env.VUE_APP_PAGESIZE_OPTS && process.env.VUE_APP_PAGESIZE_OPTS.length ? JSON.parse(process.env.VUE_APP_PAGESIZE_OPTS) : [4, 8, 10],
// APP_VERSION: '0.3.6',

