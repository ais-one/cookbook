import Fetch from './fetch.js'

const val = () => {
  // try catch
  // let token = window.location.hash.substring(1) // (new URL(window.location.href)).searchParams.get('token')
  // if (!token) this.getFromLocalStorage()
  // if (!token) this.login()
  // else this.setToken(token)
}

export const samlLogin = (samlUrl, callbackUrl) => {
  const port = window.location.port === '443' || window.location.port === '80' ? '' : ':' + window.location.port
  const redirect = window.location.protocol + '//' + window.location.hostname + port + callbackUrl
  const { urlFull } = Fetch.parseUrl(`/api/saml/login?redirect_to=${redirect}&groups=&expiry=`, samlUrl)
  window.location.assign(urlFull)
}

// logout - cleartoken - window.location.replace('https://adfc.test.com/adfs/ls/?wa=wsignout1.0&wreply='+ encodeURIComponent(LOGOUT_URL))
// mounted
//   import Abc from './asdasd.js'
//   let abc = new Abc(conf)
//   abc.val()
//   if (abc._token) {
//     this.payload = abc._payload
//     this.token = abc._token  }
