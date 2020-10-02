 const config = {
  API_URL: process.env.VUE_APP_API_URL || 'http://127.0.0.1:3000', // https://127.0.0.1:3000
  // WS_URL: process.env.VUE_APP_WS_URL || process.env.VUE_APP_WS_URL === undefined ? 'ws://127.0.0.1:3001' : '' // 'wss://echo.websocket.org'
  WS_URL: process.env.VUE_APP_WS_URL || 'ws://127.0.0.1:3001', // wss://127.0.0.1:3001
  RECAPTCHA_KEY: process.env.VUE_APP_RECAPTCHA_KEY || '', // localhost - 6LcjlzkUAAAAAOwP26tCRCivcYyAu3hQ7AlMPLh3

  // Use localStorage / sessionStorage
  HTTPONLY_TOKEN: false, // true, false use HTTPONLY_TOKEN for more security, but needs same domain
  WITH_CREDENTIALS: false, // true = use same origin, false = cors
  // HTTPONLY_TOKEN
  // HTTPONLY_TOKEN: true
  // WITH_CREDENTIALS: true
  GITHUB_CLIENT_ID: process.env.VUE_APP_GITHUB_CLIENT_ID || '',

  PAGESIZE: process.env.VUE_APP_PAGESIZE || 4,
  PAGESIZE_OPTS: process.env.VUE_APP_PAGESIZE_OPTS && process.env.VUE_APP_PAGESIZE_OPTS.length ? JSON.parse(process.env.VUE_APP_PAGESIZE_OPTS) : [4, 8, 10],

  APP_VERSION: '0.4.1',
}
// console.log('WS_URL', WS_URL, process.env.VUE_APP_WS_URL)
export const {
  API_URL, WS_URL, RECAPTCHA_KEY, HTTPONLY_TOKEN, WITH_CREDENTIALS, GITHUB_CLIENT_ID, PAGESIZE, PAGESIZE_OPTS, APP_VERSION
} = config 
