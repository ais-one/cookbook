export const USE_OTP = process.env.VUE_APP_USE_OTP || '' // GA, SMS, ''
export const API_URL = process.env.VUE_APP_API_URL || 'http://127.0.0.1:3000' // https://127.0.0.1:3000
// export const WS_URL = process.env.VUE_APP_WS_URL || process.env.VUE_APP_WS_URL === undefined ? 'ws://127.0.0.1:3001' : '' // 'wss://echo.websocket.org'
// console.log('WS_URL', WS_URL, process.env.VUE_APP_WS_URL)
export const WS_URL = process.env.VUE_APP_WS_URL || 'ws://127.0.0.1:3001' // wss://127.0.0.1:3001
export const MONGO_STITCH = process.env.VUE_APP_MONGO_STITCH || ''
export const RECAPTCHA_KEY = process.env.VUE_APP_RECAPTCHA_KEY || '' // localhost - 6LcjlzkUAAAAAOwP26tCRCivcYyAu3hQ7AlMPLh3
export const HTTPONLY_TOKEN = true // use HTTPONLY_TOKEN for more security, but needs same domain
// export const HTTPONLY_TOKEN = false
export const firebaseCfg = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: ''
}
