import setup from './apploader.js'
import { version } from './package.json'

// const setup = await import('./src/' + VITE_APPNAME + '/setup.js').default // await causes problems

// console.log('fffff', process.env.NODE_ENV, import.meta.env)
export const {
  VITE_API_URL,

  VITE_WS_URL, // ws://127.0.0.1:3001, wss://127.0.0.1:3001
  VITE_WS_MS,
  VITE_PWA_PN, // Webpush, FCM
  // NOT NEEDED... BACKEND DETERMINES VITE_USE_OTP, // GA, SMS, ''
  VITE_RECAPTCHA_KEY,
  // VITE_HTTPONLY_TOKEN = false, // true, // NOTUSED... replaced by VITE_WITH_CREDENTIALS
  VITE_WITH_CREDENTIALS = 'same-origin', // same-origin, include = cors

  VITE_OIDC_URL,
  VITE_OAUTH_URL,
  VITE_OAUTH_CLIENT_ID,
  VITE_SAML_URL,
  VITE_CALLBACK_URL,
  VITE_REFRESH_URL,
  VITE_REFRESH_URL_MANAGED,

  BASE_URL, // from vite.config.js base property

  // From setup.js
  LAYOUTS = setup.LAYOUTS,
  ROUTES = setup.ROUTES,
  PUBLIC_ROUTES = setup.PUBLIC_ROUTES,
  SECURE_ROUTES = setup.SECURE_ROUTES,
  INITIAL_SECURE_PATH = setup.INITIAL_SECURE_PATH,
  INITIAL_PUBLIC_PATH = setup.INITIAL_PUBLIC_PATH,

  VERSION = version,
  ON_LOGIN = setup.ON_LOGIN,
  ON_LOGOUT = setup.ON_LOGOUT
} = import.meta.env

// APP_VERSION: '0.0.0' // TBD Use package.json version

// PAGESIZE: process.env.VUE_APP_PAGESIZE || 4,
// PAGESIZE_OPTS: process.env.VUE_APP_PAGESIZE_OPTS && process.env.VUE_APP_PAGESIZE_OPTS.length ? JSON.parse(process.env.VUE_APP_PAGESIZE_OPTS) : [4, 8, 10],
