import Fetch from './fetch.js'

// window.location.hash.substring(1) // (new URL(window.location.href)).searchParams.get('token')
export const samlLogin = (samlUrl, callbackUrl) => {
  const port = window.location.port === '443' || window.location.port === '80' ? '' : ':' + window.location.port
  const redirect = window.location.protocol + '//' + window.location.hostname + port + callbackUrl
  const { urlFull } = Fetch.parseUrl(`/api/saml/login?RelayState=${redirect}`, samlUrl)
  window.location.assign(urlFull)
}
