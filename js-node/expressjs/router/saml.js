'use strict'

// working SAML ADFS example
// no refresh token, issue own OAuth2 like JWT server

const express = require('express')
const passport = require('passport')
const { createToken, setTokensToHeader } = require('@es-labs/node/auth')

const { SAML_OPTIONS, SAML_JWT_MAP, SAML_CERTIFICATE, SAML_PRIVATE_KEY } = process.env
const { AUTH_ERROR_URL } = process.env

const saml_opts = JSON.parse(SAML_OPTIONS || null)
if (saml_opts) {
  if (SAML_CERTIFICATE) saml_opts.privateCert = SAML_CERTIFICATE
  if (SAML_PRIVATE_KEY) {
    saml_opts.privateKey = SAML_PRIVATE_KEY
    saml_opts.decryptionPvk = SAML_PRIVATE_KEY
  }  
}

let samlStrategy

const { SAML } = require('node-saml')
const samlx = new SAML(saml_opts)
// console.log(saml_opts)
// cause problems in samlx
// privateCert: samlPems.cert,
// await saml.getLogoutResponseUrl({user, samlLogoutRequest}, {additionalParams});
// const {success} = await saml.validateRedirect(query, originalQuery);
// await saml.validatePostResponse(body);
// await saml.validatePostRequest(body);
// await saml.getAuthorizeForm();
// await saml.getAuthorizeUrl(options);
// await saml.getLogoutUrl(user, options);
// saml.generateServiceProviderMetadata(decryptionCert, signingCert);

if (saml_opts) {
  const SamlStrategy = require('passport-saml').Strategy
  samlStrategy = new SamlStrategy(
    saml_opts,
    (profile, done) => {
      // console.log('profile', profile)
      return done(null, { // map whatever claims/profile info you want here
        // upn: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn'],
        // // e.g. if you added a Group claim
        // group: profile['http://schemas.xmlsoap.org/claims/Group']
        ...profile
      })
    }
  )
  passport.use('saml', samlStrategy)
}

// TO IDP
// fetch("http://127.0.0.1:8081/auth/realms/test/protocol/saml?SAMLRequest=fZFfT8IwFMW%2FStP3rX9kbDQwgvIgCUYi0wdfTClVGrtu9nbEj283JMHEkD6199xz7u92Ov%2BuLTpqD6ZxM8xSiuflFGRtW7HowsE96a9OQ0BR5kAMhRnuvBONBAPCyVqDCEpsFw9rwVMqWt%2BERjUWo9Vyht92ktIsG00U53vN82Isx%2B8YvZwDY0cUAnR65SBIF%2BIT5Syhk4QWFWUiywUfpXnGXjHa%2FFrfGrc37uP6HLuTCMR9VW2SzeO2wmgZSYyTYYg%2BhNAKQhjPUxoPEwUtGJERmngtbQ0kRDk585CeHaMFgPa9wV3joKu132p%2FNEo%2FP63%2FsbyhlBLZmqGZKGntTqpPfNqwGLj9xWqvE8lzNC77yZK%2BI1HWaBem5MKwPN3%2BfmD5Aw%3D%3D&RelayState=http%3A%2F%2F127.0.0.1%3A8080%2Fcallback&SigAlg=http%3A%2F%2Fwww.w3.org%2F2001%2F04%2Fxmldsig-more%23rsa-sha256&Signature=lTwPra2YHoA7UnDr%2B42LOtttiDINFvNBKNJeEFBzrRUPdA%2BYghIHRd%2BDL01gybP%2BeR1GsRcVu9coqvhfl%2FvRLcHV4nmjdh1OKLK75%2BhqJC1TS%2FE59Io6aJFQztcRsw4Ygpxc6djVk606yqB44kwG6PwJvQuLVASH3p9vT9LObBM%3D", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//     "accept-language": "en-US,en;q=0.9",
//     "cache-control": "no-cache",
//     "pragma": "no-cache",
//     "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "document",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "same-site",
//     "upgrade-insecure-requests": "1"
//   },
//   "referrer": "http://127.0.0.1:8080/",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "include"
// });

// FROM IDP
// fetch("http://127.0.0.1:3000/api/saml/callback", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//     "accept-language": "en-US,en;q=0.9",
//     "cache-control": "no-cache",
//     "content-type": "application/x-www-form-urlencoded",
//     "pragma": "no-cache",
//     "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "document",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "same-site",
//     "upgrade-insecure-requests": "1"
//   },
//   "referrerPolicy": "no-referrer",
//   "body": "SAMLResponse=PHNhbWxwOlJlc3BvbnNlIHhtbG5zOnNhbWxwPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6cHJvdG9jb2wiIHhtbG5zOnNhbWw9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iIERlc3RpbmF0aW9uPSJodHRwOi8vMTI3LjAuMC4xOjMwMDAvYXBpL3NhbWwvY2FsbGJhY2siIElEPSJJRF9mMzRlYTVkNC05YzkwLTQ5YjMtYTA5MS1hYjJmMDRkMTViOGYiIEluUmVzcG9uc2VUbz0iX2JhMDA1NTQ5YzIyZGUyNzg2YTZmIiBJc3N1ZUluc3RhbnQ9IjIwMjEtMDktMDdUMDM6MTM6NTUuMjEzWiIgVmVyc2lvbj0iMi4wIj48c2FtbDpJc3N1ZXI%2BaHR0cDovLzEyNy4wLjAuMTo4MDgxL2F1dGgvcmVhbG1zL3Rlc3Q8L3NhbWw6SXNzdWVyPjxkc2lnOlNpZ25hdHVyZSB4bWxuczpkc2lnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjIj48ZHNpZzpTaWduZWRJbmZvPjxkc2lnOkNhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz48ZHNpZzpTaWduYXR1cmVNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNyc2Etc2hhMjU2Ii8%2BPGRzaWc6UmVmZXJlbmNlIFVSST0iI0lEX2YzNGVhNWQ0LTljOTAtNDliMy1hMDkxLWFiMmYwNGQxNWI4ZiI%2BPGRzaWc6VHJhbnNmb3Jtcz48ZHNpZzpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjZW52ZWxvcGVkLXNpZ25hdHVyZSIvPjxkc2lnOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyIvPjwvZHNpZzpUcmFuc2Zvcm1zPjxkc2lnOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTI1NiIvPjxkc2lnOkRpZ2VzdFZhbHVlPlhpRFlpZ0dzWHhteWJCSGgyeFJweEFjRXJvQ2tKVUZLRkJGN3pMQ0RjVDg9PC9kc2lnOkRpZ2VzdFZhbHVlPjwvZHNpZzpSZWZlcmVuY2U%2BPC9kc2lnOlNpZ25lZEluZm8%2BPGRzaWc6U2lnbmF0dXJlVmFsdWU%2BUFRmZGgrb09pMW14ZXlFUGxtaEQwMUhFTm1lbjl1Y1ROeC9tVVhlQUtPalpUWE5JczFhT3RDVEFRMGZHVGdRRGQxaEg0SWtFeGpyYThNUTR1TGVkVlVCOHR1K3NZQVlUTld2Z0dXdkdyWTVPSkxDQ212Q3ljeHJ4b1pTejY5MmN2dkMwQlhKRmNNZ2d5M09JeG4rVkNLNXRsMXc1TXhiSE1UdEsxNjdHUVZ6eHpkcERqUmUxbUZIeUVNYUx3dm1KUnVYbHpMMVBSb25kT2xJMHpjS0E4a0NoYndFSEVGQXNzUVk0RzF5dlB4a3llMTVBQlIrUHJsVzhXcVVMcWdnSGltL3BpbTRtUmVRL1ZnN1lXcElYQkpYZU04aFVtS0hUTnJoRnZCWm5qMlhiQUllTXVQMWVXTVQ1VFRxZ296VEluUFIvaXV2SDBOOWtrYjlleUdKSjZBPT08L2RzaWc6U2lnbmF0dXJlVmFsdWU%2BPGRzaWc6S2V5SW5mbz48ZHNpZzpLZXlOYW1lPjIzNjFwUTA5MGRaeDhJQ1A5amYtX3FxaE9ScVRnbktqcGQyVUJ4dHNlbGc8L2RzaWc6S2V5TmFtZT48ZHNpZzpYNTA5RGF0YT48ZHNpZzpYNTA5Q2VydGlmaWNhdGU%2BTUlJQ2x6Q0NBWDhDQmdGNkEwc0FoREFOQmdrcWhraUc5dzBCQVFzRkFEQVBNUTB3Q3dZRFZRUUREQVIwWlhOME1CNFhEVEl4TURZeE16QXlOVE13TkZvWERUTXhNRFl4TXpBeU5UUTBORm93RHpFTk1Bc0dBMVVFQXd3RWRHVnpkRENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NBUW9DZ2dFQkFLOTdObENjTk9odEgwYTB3ejVib1lLYjdUYXhvZ3hubHl5c09XVXJlMXVJOFNDNkVCVjNHNURITWRnNGFXWHd1WHd5NjErSkp1NzB4TnpKajE1NU1KK2F0R1M3ZUxyeHhHbDBETm9MdS9MVTdWaGh0K2owOU1adDVKNjBEblM3NkgzcGt2ekF0UmZkMVAvZDVKRUZ6V1lrSTRkckJKY2NZWC9ucnJ4MktaQmtYT2p3alZjRWhzeUs1eWtBMExYK00reUZEeTJ3OHFFV2h4SHVTTDZlbnp3OElaN3FkdHNGOFNIcXc3Y2RDZ0NKVTYrMGR4YVJBQXFtek1rTzdCREVrd0NKbDBNOFZhT1BHby9TblpJQU1ZSExJVWcxeDBoL2VjU1Q0TlBkcUF3Z0RHdFdBY0QrR3A3THI3eGZCYktLcW5MZmcyUEpkanM3WjArTkZPZVZUdmNDQXdFQUFUQU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFlSjJyMnlvYVFBbzZ2OE1DNmlBb2JPZUpvQm9lelFnL09TUXFlQTlseWdNV21HSHBESWpTVjdtM1BDWHdmNUg5L05wSGdCTHQ4eTVQY2pFczk5dVBmUGVVQlYvcWl0VEZNdXpuTXlyMzVlNjBpYUhTZGhaVmp5Q21yS2duSXVHYTA3bG5nMndGYWJ0cGlqcXpiUUo5OWtZc1d4YkJEZ2JkVm50M2p4b2hHMUtLYVhrR015eTdzdXdQZ3dyYndYZkRycHl5ajMzTlQvRGsvMlc0Rmpyamc4cklrdVF5cHdCMFNRTEcxY1pMOVoyQWdXMzlKZVZuUC9zT0gxZ05wQ0NRd2JwZ0U5aEVlZDgwanNZV2x2dWNuRm0yYUhCdEdWKy83LzdOM3FSUnBJdnpyTlZKb3pucUREV1U0MVJ4UzBOcGhBd1gyWnFwcld2TitTQ0VFaFBHR1E9PTwvZHNpZzpYNTA5Q2VydGlmaWNhdGU%2BPC9kc2lnOlg1MDlEYXRhPjxkc2lnOktleVZhbHVlPjxkc2lnOlJTQUtleVZhbHVlPjxkc2lnOk1vZHVsdXM%2BcjNzMlVKdzA2RzBmUnJURFBsdWhncHZ0TnJHaURHZVhMS3c1WlN0N1c0anhJTG9RRlhjYmtNY3gyRGhwWmZDNWZETHJYNGttN3ZURTNNbVBYbmt3bjVxMFpMdDR1dkhFYVhRTTJndTc4dFR0V0dHMzZQVDB4bTNrbnJRT2RMdm9mZW1TL01DMUY5M1UvOTNra1FYTlppUWpoMnNFbHh4aGYrZXV2SFlwa0dSYzZQQ05Wd1NHeklybktRRFF0ZjR6N0lVUExiRHlvUmFIRWU1SXZwNmZQRHdobnVwMjJ3WHhJZXJEdHgwS0FJbFRyN1IzRnBFQUNxYk15UTdzRU1TVEFJbVhRenhWbzQ4YWo5S2RrZ0F4Z2NzaFNEWEhTSDk1eEpQZzA5Mm9EQ0FNYTFZQndQNGFuc3V2dkY4RnNvcXFjdCtEWThsMk96dG5UNDBVNTVWTzl3PT08L2RzaWc6TW9kdWx1cz48ZHNpZzpFeHBvbmVudD5BUUFCPC9kc2lnOkV4cG9uZW50PjwvZHNpZzpSU0FLZXlWYWx1ZT48L2RzaWc6S2V5VmFsdWU%2BPC9kc2lnOktleUluZm8%2BPC9kc2lnOlNpZ25hdHVyZT48c2FtbHA6U3RhdHVzPjxzYW1scDpTdGF0dXNDb2RlIFZhbHVlPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6c3RhdHVzOlN1Y2Nlc3MiLz48L3NhbWxwOlN0YXR1cz48c2FtbDpBc3NlcnRpb24geG1sbnM9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iIElEPSJJRF8wNzRlYTI5NC0zOTk1LTQ5ZTctYTUzNC1jYTdlMjI2MDhhNDUiIElzc3VlSW5zdGFudD0iMjAyMS0wOS0wN1QwMzoxMzo1NS4yMTJaIiBWZXJzaW9uPSIyLjAiPjxzYW1sOklzc3Vlcj5odHRwOi8vMTI3LjAuMC4xOjgwODEvYXV0aC9yZWFsbXMvdGVzdDwvc2FtbDpJc3N1ZXI%2BPHNhbWw6U3ViamVjdD48c2FtbDpOYW1lSUQgRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoxLjE6bmFtZWlkLWZvcm1hdDp1bnNwZWNpZmllZCI%2BdGVzdC11c2VyPC9zYW1sOk5hbWVJRD48c2FtbDpTdWJqZWN0Q29uZmlybWF0aW9uIE1ldGhvZD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmNtOmJlYXJlciI%2BPHNhbWw6U3ViamVjdENvbmZpcm1hdGlvbkRhdGEgSW5SZXNwb25zZVRvPSJfYmEwMDU1NDljMjJkZTI3ODZhNmYiIE5vdE9uT3JBZnRlcj0iMjAyMS0wOS0wN1QwMzoxODo1My4yMTJaIiBSZWNpcGllbnQ9Imh0dHA6Ly8xMjcuMC4wLjE6MzAwMC9hcGkvc2FtbC9jYWxsYmFjayIvPjwvc2FtbDpTdWJqZWN0Q29uZmlybWF0aW9uPjwvc2FtbDpTdWJqZWN0PjxzYW1sOkNvbmRpdGlvbnMgTm90QmVmb3JlPSIyMDIxLTA5LTA3VDAzOjEzOjUzLjIxMloiIE5vdE9uT3JBZnRlcj0iMjAyMS0wOS0wN1QwMzoxNDo1My4yMTJaIj48c2FtbDpBdWRpZW5jZVJlc3RyaWN0aW9uPjxzYW1sOkF1ZGllbmNlPnRlc3Qtc2FtbC1jbGllbnQ8L3NhbWw6QXVkaWVuY2U%2BPC9zYW1sOkF1ZGllbmNlUmVzdHJpY3Rpb24%2BPC9zYW1sOkNvbmRpdGlvbnM%2BPHNhbWw6QXV0aG5TdGF0ZW1lbnQgQXV0aG5JbnN0YW50PSIyMDIxLTA5LTA3VDAzOjEzOjU1LjIxM1oiIFNlc3Npb25JbmRleD0iMzBmMGU0NDgtY2I0OC00NTg1LWE2ZjYtY2Y0ZTQ1YTQxMjMzOjo1ZGZlZDA3MC1iNzgxLTQ2YmYtODBiYS1kMzQ4YWU1NTEzNTQiIFNlc3Npb25Ob3RPbk9yQWZ0ZXI9IjIwMjEtMDktMDdUMTM6MTM6NTUuMjEzWiI%2BPHNhbWw6QXV0aG5Db250ZXh0PjxzYW1sOkF1dGhuQ29udGV4dENsYXNzUmVmPnVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphYzpjbGFzc2VzOnVuc3BlY2lmaWVkPC9zYW1sOkF1dGhuQ29udGV4dENsYXNzUmVmPjwvc2FtbDpBdXRobkNvbnRleHQ%2BPC9zYW1sOkF1dGhuU3RhdGVtZW50PjxzYW1sOkF0dHJpYnV0ZVN0YXRlbWVudD48c2FtbDpBdHRyaWJ1dGUgTmFtZT0iUm9sZSIgTmFtZUZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmF0dHJuYW1lLWZvcm1hdDpiYXNpYyI%2BPHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj5kZWZhdWx0LXJvbGVzLXRlc3Q8L3NhbWw6QXR0cmlidXRlVmFsdWU%2BPHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj5vZmZsaW5lX2FjY2Vzczwvc2FtbDpBdHRyaWJ1dGVWYWx1ZT48c2FtbDpBdHRyaWJ1dGVWYWx1ZSB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhzaTp0eXBlPSJ4czpzdHJpbmciPm1hbmFnZS1hY2NvdW50LWxpbmtzPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI%2BbWFuYWdlLWFjY291bnQ8L3NhbWw6QXR0cmlidXRlVmFsdWU%2BPHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj52aWV3LXByb2ZpbGU8L3NhbWw6QXR0cmlidXRlVmFsdWU%2BPHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj50ZXN0LW9pZGMtY2xpZW50LWZhdnYtcm9sZS0xPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI%2BdW1hX2F1dGhvcml6YXRpb248L3NhbWw6QXR0cmlidXRlVmFsdWU%2BPHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj50ZXN0LW9pZGMtY2xpZW50LWZhdnYtcm9sZS0yPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI%2BdGVzdC1jbGllbnQtcm9sZS0yPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI%2BdGVzdC1jbGllbnQtcm9sZS0xPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjwvc2FtbDpBdHRyaWJ1dGU%2BPC9zYW1sOkF0dHJpYnV0ZVN0YXRlbWVudD48L3NhbWw6QXNzZXJ0aW9uPjwvc2FtbHA6UmVzcG9uc2U%2B&RelayState=http%3A%2F%2F127.0.0.1%3A8080%2Fcallback",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });


const bodyx = {
  SAMLResponse: 'PHNhbWxwOlJlc3BvbnNlIHhtbG5zOnNhbWxwPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6cHJvdG9jb2wiIHhtbG5zOnNhbWw9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iIERlc3RpbmF0aW9uPSJodHRwOi8vMTI3LjAuMC4xOjMwMDAvYXBpL3NhbWwvY2FsbGJhY2siIElEPSJJRF9mMzRlYTVkNC05YzkwLTQ5YjMtYTA5MS1hYjJmMDRkMTViOGYiIEluUmVzcG9uc2VUbz0iX2JhMDA1NTQ5YzIyZGUyNzg2YTZmIiBJc3N1ZUluc3RhbnQ9IjIwMjEtMDktMDdUMDM6MTM6NTUuMjEzWiIgVmVyc2lvbj0iMi4wIj48c2FtbDpJc3N1ZXI+aHR0cDovLzEyNy4wLjAuMTo4MDgxL2F1dGgvcmVhbG1zL3Rlc3Q8L3NhbWw6SXNzdWVyPjxkc2lnOlNpZ25hdHVyZSB4bWxuczpkc2lnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjIj48ZHNpZzpTaWduZWRJbmZvPjxkc2lnOkNhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz48ZHNpZzpTaWduYXR1cmVNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNyc2Etc2hhMjU2Ii8+PGRzaWc6UmVmZXJlbmNlIFVSST0iI0lEX2YzNGVhNWQ0LTljOTAtNDliMy1hMDkxLWFiMmYwNGQxNWI4ZiI+PGRzaWc6VHJhbnNmb3Jtcz48ZHNpZzpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjZW52ZWxvcGVkLXNpZ25hdHVyZSIvPjxkc2lnOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyIvPjwvZHNpZzpUcmFuc2Zvcm1zPjxkc2lnOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTI1NiIvPjxkc2lnOkRpZ2VzdFZhbHVlPlhpRFlpZ0dzWHhteWJCSGgyeFJweEFjRXJvQ2tKVUZLRkJGN3pMQ0RjVDg9PC9kc2lnOkRpZ2VzdFZhbHVlPjwvZHNpZzpSZWZlcmVuY2U+PC9kc2lnOlNpZ25lZEluZm8+PGRzaWc6U2lnbmF0dXJlVmFsdWU+UFRmZGgrb09pMW14ZXlFUGxtaEQwMUhFTm1lbjl1Y1ROeC9tVVhlQUtPalpUWE5JczFhT3RDVEFRMGZHVGdRRGQxaEg0SWtFeGpyYThNUTR1TGVkVlVCOHR1K3NZQVlUTld2Z0dXdkdyWTVPSkxDQ212Q3ljeHJ4b1pTejY5MmN2dkMwQlhKRmNNZ2d5M09JeG4rVkNLNXRsMXc1TXhiSE1UdEsxNjdHUVZ6eHpkcERqUmUxbUZIeUVNYUx3dm1KUnVYbHpMMVBSb25kT2xJMHpjS0E4a0NoYndFSEVGQXNzUVk0RzF5dlB4a3llMTVBQlIrUHJsVzhXcVVMcWdnSGltL3BpbTRtUmVRL1ZnN1lXcElYQkpYZU04aFVtS0hUTnJoRnZCWm5qMlhiQUllTXVQMWVXTVQ1VFRxZ296VEluUFIvaXV2SDBOOWtrYjlleUdKSjZBPT08L2RzaWc6U2lnbmF0dXJlVmFsdWU+PGRzaWc6S2V5SW5mbz48ZHNpZzpLZXlOYW1lPjIzNjFwUTA5MGRaeDhJQ1A5amYtX3FxaE9ScVRnbktqcGQyVUJ4dHNlbGc8L2RzaWc6S2V5TmFtZT48ZHNpZzpYNTA5RGF0YT48ZHNpZzpYNTA5Q2VydGlmaWNhdGU+TUlJQ2x6Q0NBWDhDQmdGNkEwc0FoREFOQmdrcWhraUc5dzBCQVFzRkFEQVBNUTB3Q3dZRFZRUUREQVIwWlhOME1CNFhEVEl4TURZeE16QXlOVE13TkZvWERUTXhNRFl4TXpBeU5UUTBORm93RHpFTk1Bc0dBMVVFQXd3RWRHVnpkRENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NBUW9DZ2dFQkFLOTdObENjTk9odEgwYTB3ejVib1lLYjdUYXhvZ3hubHl5c09XVXJlMXVJOFNDNkVCVjNHNURITWRnNGFXWHd1WHd5NjErSkp1NzB4TnpKajE1NU1KK2F0R1M3ZUxyeHhHbDBETm9MdS9MVTdWaGh0K2owOU1adDVKNjBEblM3NkgzcGt2ekF0UmZkMVAvZDVKRUZ6V1lrSTRkckJKY2NZWC9ucnJ4MktaQmtYT2p3alZjRWhzeUs1eWtBMExYK00reUZEeTJ3OHFFV2h4SHVTTDZlbnp3OElaN3FkdHNGOFNIcXc3Y2RDZ0NKVTYrMGR4YVJBQXFtek1rTzdCREVrd0NKbDBNOFZhT1BHby9TblpJQU1ZSExJVWcxeDBoL2VjU1Q0TlBkcUF3Z0RHdFdBY0QrR3A3THI3eGZCYktLcW5MZmcyUEpkanM3WjArTkZPZVZUdmNDQXdFQUFUQU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFlSjJyMnlvYVFBbzZ2OE1DNmlBb2JPZUpvQm9lelFnL09TUXFlQTlseWdNV21HSHBESWpTVjdtM1BDWHdmNUg5L05wSGdCTHQ4eTVQY2pFczk5dVBmUGVVQlYvcWl0VEZNdXpuTXlyMzVlNjBpYUhTZGhaVmp5Q21yS2duSXVHYTA3bG5nMndGYWJ0cGlqcXpiUUo5OWtZc1d4YkJEZ2JkVm50M2p4b2hHMUtLYVhrR015eTdzdXdQZ3dyYndYZkRycHl5ajMzTlQvRGsvMlc0Rmpyamc4cklrdVF5cHdCMFNRTEcxY1pMOVoyQWdXMzlKZVZuUC9zT0gxZ05wQ0NRd2JwZ0U5aEVlZDgwanNZV2x2dWNuRm0yYUhCdEdWKy83LzdOM3FSUnBJdnpyTlZKb3pucUREV1U0MVJ4UzBOcGhBd1gyWnFwcld2TitTQ0VFaFBHR1E9PTwvZHNpZzpYNTA5Q2VydGlmaWNhdGU+PC9kc2lnOlg1MDlEYXRhPjxkc2lnOktleVZhbHVlPjxkc2lnOlJTQUtleVZhbHVlPjxkc2lnOk1vZHVsdXM+cjNzMlVKdzA2RzBmUnJURFBsdWhncHZ0TnJHaURHZVhMS3c1WlN0N1c0anhJTG9RRlhjYmtNY3gyRGhwWmZDNWZETHJYNGttN3ZURTNNbVBYbmt3bjVxMFpMdDR1dkhFYVhRTTJndTc4dFR0V0dHMzZQVDB4bTNrbnJRT2RMdm9mZW1TL01DMUY5M1UvOTNra1FYTlppUWpoMnNFbHh4aGYrZXV2SFlwa0dSYzZQQ05Wd1NHeklybktRRFF0ZjR6N0lVUExiRHlvUmFIRWU1SXZwNmZQRHdobnVwMjJ3WHhJZXJEdHgwS0FJbFRyN1IzRnBFQUNxYk15UTdzRU1TVEFJbVhRenhWbzQ4YWo5S2RrZ0F4Z2NzaFNEWEhTSDk1eEpQZzA5Mm9EQ0FNYTFZQndQNGFuc3V2dkY4RnNvcXFjdCtEWThsMk96dG5UNDBVNTVWTzl3PT08L2RzaWc6TW9kdWx1cz48ZHNpZzpFeHBvbmVudD5BUUFCPC9kc2lnOkV4cG9uZW50PjwvZHNpZzpSU0FLZXlWYWx1ZT48L2RzaWc6S2V5VmFsdWU+PC9kc2lnOktleUluZm8+PC9kc2lnOlNpZ25hdHVyZT48c2FtbHA6U3RhdHVzPjxzYW1scDpTdGF0dXNDb2RlIFZhbHVlPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6c3RhdHVzOlN1Y2Nlc3MiLz48L3NhbWxwOlN0YXR1cz48c2FtbDpBc3NlcnRpb24geG1sbnM9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iIElEPSJJRF8wNzRlYTI5NC0zOTk1LTQ5ZTctYTUzNC1jYTdlMjI2MDhhNDUiIElzc3VlSW5zdGFudD0iMjAyMS0wOS0wN1QwMzoxMzo1NS4yMTJaIiBWZXJzaW9uPSIyLjAiPjxzYW1sOklzc3Vlcj5odHRwOi8vMTI3LjAuMC4xOjgwODEvYXV0aC9yZWFsbXMvdGVzdDwvc2FtbDpJc3N1ZXI+PHNhbWw6U3ViamVjdD48c2FtbDpOYW1lSUQgRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoxLjE6bmFtZWlkLWZvcm1hdDp1bnNwZWNpZmllZCI+dGVzdC11c2VyPC9zYW1sOk5hbWVJRD48c2FtbDpTdWJqZWN0Q29uZmlybWF0aW9uIE1ldGhvZD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmNtOmJlYXJlciI+PHNhbWw6U3ViamVjdENvbmZpcm1hdGlvbkRhdGEgSW5SZXNwb25zZVRvPSJfYmEwMDU1NDljMjJkZTI3ODZhNmYiIE5vdE9uT3JBZnRlcj0iMjAyMS0wOS0wN1QwMzoxODo1My4yMTJaIiBSZWNpcGllbnQ9Imh0dHA6Ly8xMjcuMC4wLjE6MzAwMC9hcGkvc2FtbC9jYWxsYmFjayIvPjwvc2FtbDpTdWJqZWN0Q29uZmlybWF0aW9uPjwvc2FtbDpTdWJqZWN0PjxzYW1sOkNvbmRpdGlvbnMgTm90QmVmb3JlPSIyMDIxLTA5LTA3VDAzOjEzOjUzLjIxMloiIE5vdE9uT3JBZnRlcj0iMjAyMS0wOS0wN1QwMzoxNDo1My4yMTJaIj48c2FtbDpBdWRpZW5jZVJlc3RyaWN0aW9uPjxzYW1sOkF1ZGllbmNlPnRlc3Qtc2FtbC1jbGllbnQ8L3NhbWw6QXVkaWVuY2U+PC9zYW1sOkF1ZGllbmNlUmVzdHJpY3Rpb24+PC9zYW1sOkNvbmRpdGlvbnM+PHNhbWw6QXV0aG5TdGF0ZW1lbnQgQXV0aG5JbnN0YW50PSIyMDIxLTA5LTA3VDAzOjEzOjU1LjIxM1oiIFNlc3Npb25JbmRleD0iMzBmMGU0NDgtY2I0OC00NTg1LWE2ZjYtY2Y0ZTQ1YTQxMjMzOjo1ZGZlZDA3MC1iNzgxLTQ2YmYtODBiYS1kMzQ4YWU1NTEzNTQiIFNlc3Npb25Ob3RPbk9yQWZ0ZXI9IjIwMjEtMDktMDdUMTM6MTM6NTUuMjEzWiI+PHNhbWw6QXV0aG5Db250ZXh0PjxzYW1sOkF1dGhuQ29udGV4dENsYXNzUmVmPnVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphYzpjbGFzc2VzOnVuc3BlY2lmaWVkPC9zYW1sOkF1dGhuQ29udGV4dENsYXNzUmVmPjwvc2FtbDpBdXRobkNvbnRleHQ+PC9zYW1sOkF1dGhuU3RhdGVtZW50PjxzYW1sOkF0dHJpYnV0ZVN0YXRlbWVudD48c2FtbDpBdHRyaWJ1dGUgTmFtZT0iUm9sZSIgTmFtZUZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmF0dHJuYW1lLWZvcm1hdDpiYXNpYyI+PHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj5kZWZhdWx0LXJvbGVzLXRlc3Q8L3NhbWw6QXR0cmlidXRlVmFsdWU+PHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj5vZmZsaW5lX2FjY2Vzczwvc2FtbDpBdHRyaWJ1dGVWYWx1ZT48c2FtbDpBdHRyaWJ1dGVWYWx1ZSB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhzaTp0eXBlPSJ4czpzdHJpbmciPm1hbmFnZS1hY2NvdW50LWxpbmtzPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI+bWFuYWdlLWFjY291bnQ8L3NhbWw6QXR0cmlidXRlVmFsdWU+PHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj52aWV3LXByb2ZpbGU8L3NhbWw6QXR0cmlidXRlVmFsdWU+PHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj50ZXN0LW9pZGMtY2xpZW50LWZhdnYtcm9sZS0xPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI+dW1hX2F1dGhvcml6YXRpb248L3NhbWw6QXR0cmlidXRlVmFsdWU+PHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj50ZXN0LW9pZGMtY2xpZW50LWZhdnYtcm9sZS0yPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI+dGVzdC1jbGllbnQtcm9sZS0yPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI+dGVzdC1jbGllbnQtcm9sZS0xPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjwvc2FtbDpBdHRyaWJ1dGU+PC9zYW1sOkF0dHJpYnV0ZVN0YXRlbWVudD48L3NhbWw6QXNzZXJ0aW9uPjwvc2FtbHA6UmVzcG9uc2U+'
}

module.exports = express.Router()
  .get('/test', async (req,res) => {
    // console.log(samlx)
    try {
      const authUrl = await samlx.getAuthorizeUrlAsync() // validatePostResponseAsync (calls..., processValidlySignedPostRequestAsync)
      // console.log(authUrl)

      const parsedResponse = await samlx.validatePostResponseAsync(bodyx)
      // console.log(parsedResponse)

      res.json({ message: 'testing node-saml ok', authUrl, parsedResponse })
    } catch (e) {
      console.log(e) // , SAML_OPTIONS.privateCert
      res.status(500).json({message: 'testing node-saml error', error: e.toString()})
    }
  })
  .get('/metadata', (req, res) => {
    res.type('application/xml')
    // res.status(200).send(samlStrategy.generateServiceProviderMetadata()) // if there is private key involved, then need to pass in cert
    res.status(200).send(samlStrategy.generateServiceProviderMetadata(SAML_CERTIFICATE, saml_opts.privateCert)) // cert to match decryptionKey, cert to match privateKey
  })
  .get('/login',
    (req, res, next) => {
      // return res.redirect('/' + token...) // for faking, bypass real callback
      // console.debug(req.header('referer'))
      // req.query.RelayState
      next()
    },
    passport.authenticate('saml') // , { failureRedirect: '/', failureFlash: true }),
  )
  // .get('/fail', (req, res) => res.status(401).send('Login Fail')
  .post('/callback',
    passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
    async (req, res) => {
      try {
        const TO = req.body.RelayState
        if (!TO) {
          // if no RelayState, then it is a test
          return res.status(200).json({
            authenticated: req.isAuthenticated(),
            user: req.user
          })
        }
        if (req.isAuthenticated()) {
          const user = {
            id: req.user[SAML_JWT_MAP.id], // id: req.user.nameID, // string
            groups: req.user[SAML_JWT_MAP.groups], // groups: req.user.Role, // comma seperated string or array or object...
          }
          const tokens = await createToken(user)
          setTokensToHeader(res, tokens)
          return res.redirect(TO + '#' + tokens.access_token + ';' + tokens.refresh_token + ';' + JSON.stringify(tokens.user_meta)) // use url fragment...
        } else {
          return AUTH_ERROR_URL ? res.redirect(AUTH_ERROR_URL) : res.status(401).json({ error: 'NOT Authenticated' })
        }
      } catch (e) {
        return AUTH_ERROR_URL ? res.redirect(AUTH_ERROR_URL) : res.status(500).json({ error: e.toString() })
      }
    }
  )

