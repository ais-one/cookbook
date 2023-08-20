'use strict'

// auth0 customer identity cloud...? 

// working SAML ADFS example
// no refresh token, issue own OAuth2 like JWT server

const express = require('express')
const passport = require('passport')
const { createToken, setTokensToHeader } = require('@es-labs/node/auth')

const { SAML_OPTIONS, SAML_JWT_MAP, SAML_CERTIFICATE, SAML_PRIVATE_KEY } = process.env

const samlJwtMap = JSON.parse(SAML_JWT_MAP || null)
// console.log('SAML_OPTIONS', SAML_OPTIONS)

const { AUTH_ERROR_URL } = process.env
const samlOptions = JSON.parse(SAML_OPTIONS || null)
if (samlOptions) {
  if (SAML_CERTIFICATE) samlOptions.privateCert = SAML_CERTIFICATE
  if (SAML_PRIVATE_KEY) {
    samlOptions.privateKey = SAML_PRIVATE_KEY
    samlOptions.decryptionPvk = SAML_PRIVATE_KEY
  }
  samlOptions.cert = 'MIIClTCCAX0CBgGKEEL5YTANBgkqhkiG9w0BAQsFADAOMQwwCgYDVQQDDANkZXYwHhcNMjMwODIwMDAwMzU5WhcNMzMwODIwMDAwNTM5WjAOMQwwCgYDVQQDDANkZXYwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCMznFveBcEc3SpeNOWYU33ZDwo+XjLkEJUcFIskuhTui5r8XAWjWnaR0wDKqGY/UjU7s8U7zc5lL+kn63EXbpdJkdwIPX6vlgJlz7aJ2H6GGpjC4KoHjNS3qP+8MQnZ2Y04oUGE6khKaYiDTrTT1qumtDcsKpcjFcKvlaINWWhsiivsj/icHih/Zw2U+wlktsjpCXxUMLIYno8z+R170tLLvH5UQHwwBSxiU7gaVnR9+fW1DbSdEMUTm16BJ9zi+vNmbSylvuvATVqEIVMoXsjAHCBZqGKQRu8IKYkEZ0phoVzOydl9tkQWxpbVHwfjzW2ZU+bko76Tbfv22VDYSkHAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAGrBlnh1z/8WAOWhDFt7ZvUbTLdb/aWAEwaF8V21berxQKi/kHZmwVS8v1QjdUOXf1y0YoYQCzv3XnJky1cKzT6ndcVnB/LV+kEloJyUsVfYfKIzcUCNkjZtDge1rFT2Y8oQgdp/IqKkZTlKiMBgTYadhZBYLcjmlp9LebKiHlDIEF1w29/xUWQXTmcyHXjvkMxsuCcfJO3ZtFKE+jaO1Ov30iwc85VEuxreJRlw5v6i5N9un/X3pxz86Z/WS+QX8ldIddBVIQ0tQyjz4g9l4QkUm4E4/dD9KjZAqrYEVADqxdNUg25eoiYXwWKNPziyGemEbUXJTnqURzYnzW3no5c='
  samlOptions.wantAuthnResponseSigned = false
  samlOptions.wantAssertionsSigned = false
  samlOptions.passive = true
}
/*
const s2 = require('samlify');
const idp = s2.IdentityProvider({
  entityID: 'dev-client-saml',
  nameIDFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
  singleSignOnService: [],
  relayState: 'http://127.0.0.1:3000/sso.html'
});
*/
let samlStrategy
// let saml

if (samlOptions) {
  // saml = new SAML(samlOptions)

  const SamlStrategy = require('@node-saml/passport-saml').Strategy
  samlStrategy = new SamlStrategy(
    samlOptions,
    (profile, done) => {
      console.log('profile', profile)
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

const bodyx = {
  SAMLResponse: 'PHNhbWxwOlJlc3BvbnNlIHhtbG5zOnNhbWxwPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6cHJvdG9jb2wiIHhtbG5zOnNhbWw9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iIERlc3RpbmF0aW9uPSJodHRwOi8vMTI3LjAuMC4xOjMwMDAvYXBpL3NhbWwvY2FsbGJhY2siIElEPSJJRF9mMzRlYTVkNC05YzkwLTQ5YjMtYTA5MS1hYjJmMDRkMTViOGYiIEluUmVzcG9uc2VUbz0iX2JhMDA1NTQ5YzIyZGUyNzg2YTZmIiBJc3N1ZUluc3RhbnQ9IjIwMjEtMDktMDdUMDM6MTM6NTUuMjEzWiIgVmVyc2lvbj0iMi4wIj48c2FtbDpJc3N1ZXI+aHR0cDovLzEyNy4wLjAuMTo4MDgxL2F1dGgvcmVhbG1zL3Rlc3Q8L3NhbWw6SXNzdWVyPjxkc2lnOlNpZ25hdHVyZSB4bWxuczpkc2lnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjIj48ZHNpZzpTaWduZWRJbmZvPjxkc2lnOkNhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz48ZHNpZzpTaWduYXR1cmVNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNyc2Etc2hhMjU2Ii8+PGRzaWc6UmVmZXJlbmNlIFVSST0iI0lEX2YzNGVhNWQ0LTljOTAtNDliMy1hMDkxLWFiMmYwNGQxNWI4ZiI+PGRzaWc6VHJhbnNmb3Jtcz48ZHNpZzpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjZW52ZWxvcGVkLXNpZ25hdHVyZSIvPjxkc2lnOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyIvPjwvZHNpZzpUcmFuc2Zvcm1zPjxkc2lnOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTI1NiIvPjxkc2lnOkRpZ2VzdFZhbHVlPlhpRFlpZ0dzWHhteWJCSGgyeFJweEFjRXJvQ2tKVUZLRkJGN3pMQ0RjVDg9PC9kc2lnOkRpZ2VzdFZhbHVlPjwvZHNpZzpSZWZlcmVuY2U+PC9kc2lnOlNpZ25lZEluZm8+PGRzaWc6U2lnbmF0dXJlVmFsdWU+UFRmZGgrb09pMW14ZXlFUGxtaEQwMUhFTm1lbjl1Y1ROeC9tVVhlQUtPalpUWE5JczFhT3RDVEFRMGZHVGdRRGQxaEg0SWtFeGpyYThNUTR1TGVkVlVCOHR1K3NZQVlUTld2Z0dXdkdyWTVPSkxDQ212Q3ljeHJ4b1pTejY5MmN2dkMwQlhKRmNNZ2d5M09JeG4rVkNLNXRsMXc1TXhiSE1UdEsxNjdHUVZ6eHpkcERqUmUxbUZIeUVNYUx3dm1KUnVYbHpMMVBSb25kT2xJMHpjS0E4a0NoYndFSEVGQXNzUVk0RzF5dlB4a3llMTVBQlIrUHJsVzhXcVVMcWdnSGltL3BpbTRtUmVRL1ZnN1lXcElYQkpYZU04aFVtS0hUTnJoRnZCWm5qMlhiQUllTXVQMWVXTVQ1VFRxZ296VEluUFIvaXV2SDBOOWtrYjlleUdKSjZBPT08L2RzaWc6U2lnbmF0dXJlVmFsdWU+PGRzaWc6S2V5SW5mbz48ZHNpZzpLZXlOYW1lPjIzNjFwUTA5MGRaeDhJQ1A5amYtX3FxaE9ScVRnbktqcGQyVUJ4dHNlbGc8L2RzaWc6S2V5TmFtZT48ZHNpZzpYNTA5RGF0YT48ZHNpZzpYNTA5Q2VydGlmaWNhdGU+TUlJQ2x6Q0NBWDhDQmdGNkEwc0FoREFOQmdrcWhraUc5dzBCQVFzRkFEQVBNUTB3Q3dZRFZRUUREQVIwWlhOME1CNFhEVEl4TURZeE16QXlOVE13TkZvWERUTXhNRFl4TXpBeU5UUTBORm93RHpFTk1Bc0dBMVVFQXd3RWRHVnpkRENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NBUW9DZ2dFQkFLOTdObENjTk9odEgwYTB3ejVib1lLYjdUYXhvZ3hubHl5c09XVXJlMXVJOFNDNkVCVjNHNURITWRnNGFXWHd1WHd5NjErSkp1NzB4TnpKajE1NU1KK2F0R1M3ZUxyeHhHbDBETm9MdS9MVTdWaGh0K2owOU1adDVKNjBEblM3NkgzcGt2ekF0UmZkMVAvZDVKRUZ6V1lrSTRkckJKY2NZWC9ucnJ4MktaQmtYT2p3alZjRWhzeUs1eWtBMExYK00reUZEeTJ3OHFFV2h4SHVTTDZlbnp3OElaN3FkdHNGOFNIcXc3Y2RDZ0NKVTYrMGR4YVJBQXFtek1rTzdCREVrd0NKbDBNOFZhT1BHby9TblpJQU1ZSExJVWcxeDBoL2VjU1Q0TlBkcUF3Z0RHdFdBY0QrR3A3THI3eGZCYktLcW5MZmcyUEpkanM3WjArTkZPZVZUdmNDQXdFQUFUQU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFlSjJyMnlvYVFBbzZ2OE1DNmlBb2JPZUpvQm9lelFnL09TUXFlQTlseWdNV21HSHBESWpTVjdtM1BDWHdmNUg5L05wSGdCTHQ4eTVQY2pFczk5dVBmUGVVQlYvcWl0VEZNdXpuTXlyMzVlNjBpYUhTZGhaVmp5Q21yS2duSXVHYTA3bG5nMndGYWJ0cGlqcXpiUUo5OWtZc1d4YkJEZ2JkVm50M2p4b2hHMUtLYVhrR015eTdzdXdQZ3dyYndYZkRycHl5ajMzTlQvRGsvMlc0Rmpyamc4cklrdVF5cHdCMFNRTEcxY1pMOVoyQWdXMzlKZVZuUC9zT0gxZ05wQ0NRd2JwZ0U5aEVlZDgwanNZV2x2dWNuRm0yYUhCdEdWKy83LzdOM3FSUnBJdnpyTlZKb3pucUREV1U0MVJ4UzBOcGhBd1gyWnFwcld2TitTQ0VFaFBHR1E9PTwvZHNpZzpYNTA5Q2VydGlmaWNhdGU+PC9kc2lnOlg1MDlEYXRhPjxkc2lnOktleVZhbHVlPjxkc2lnOlJTQUtleVZhbHVlPjxkc2lnOk1vZHVsdXM+cjNzMlVKdzA2RzBmUnJURFBsdWhncHZ0TnJHaURHZVhMS3c1WlN0N1c0anhJTG9RRlhjYmtNY3gyRGhwWmZDNWZETHJYNGttN3ZURTNNbVBYbmt3bjVxMFpMdDR1dkhFYVhRTTJndTc4dFR0V0dHMzZQVDB4bTNrbnJRT2RMdm9mZW1TL01DMUY5M1UvOTNra1FYTlppUWpoMnNFbHh4aGYrZXV2SFlwa0dSYzZQQ05Wd1NHeklybktRRFF0ZjR6N0lVUExiRHlvUmFIRWU1SXZwNmZQRHdobnVwMjJ3WHhJZXJEdHgwS0FJbFRyN1IzRnBFQUNxYk15UTdzRU1TVEFJbVhRenhWbzQ4YWo5S2RrZ0F4Z2NzaFNEWEhTSDk1eEpQZzA5Mm9EQ0FNYTFZQndQNGFuc3V2dkY4RnNvcXFjdCtEWThsMk96dG5UNDBVNTVWTzl3PT08L2RzaWc6TW9kdWx1cz48ZHNpZzpFeHBvbmVudD5BUUFCPC9kc2lnOkV4cG9uZW50PjwvZHNpZzpSU0FLZXlWYWx1ZT48L2RzaWc6S2V5VmFsdWU+PC9kc2lnOktleUluZm8+PC9kc2lnOlNpZ25hdHVyZT48c2FtbHA6U3RhdHVzPjxzYW1scDpTdGF0dXNDb2RlIFZhbHVlPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6c3RhdHVzOlN1Y2Nlc3MiLz48L3NhbWxwOlN0YXR1cz48c2FtbDpBc3NlcnRpb24geG1sbnM9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iIElEPSJJRF8wNzRlYTI5NC0zOTk1LTQ5ZTctYTUzNC1jYTdlMjI2MDhhNDUiIElzc3VlSW5zdGFudD0iMjAyMS0wOS0wN1QwMzoxMzo1NS4yMTJaIiBWZXJzaW9uPSIyLjAiPjxzYW1sOklzc3Vlcj5odHRwOi8vMTI3LjAuMC4xOjgwODEvYXV0aC9yZWFsbXMvdGVzdDwvc2FtbDpJc3N1ZXI+PHNhbWw6U3ViamVjdD48c2FtbDpOYW1lSUQgRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoxLjE6bmFtZWlkLWZvcm1hdDp1bnNwZWNpZmllZCI+dGVzdC11c2VyPC9zYW1sOk5hbWVJRD48c2FtbDpTdWJqZWN0Q29uZmlybWF0aW9uIE1ldGhvZD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmNtOmJlYXJlciI+PHNhbWw6U3ViamVjdENvbmZpcm1hdGlvbkRhdGEgSW5SZXNwb25zZVRvPSJfYmEwMDU1NDljMjJkZTI3ODZhNmYiIE5vdE9uT3JBZnRlcj0iMjAyMS0wOS0wN1QwMzoxODo1My4yMTJaIiBSZWNpcGllbnQ9Imh0dHA6Ly8xMjcuMC4wLjE6MzAwMC9hcGkvc2FtbC9jYWxsYmFjayIvPjwvc2FtbDpTdWJqZWN0Q29uZmlybWF0aW9uPjwvc2FtbDpTdWJqZWN0PjxzYW1sOkNvbmRpdGlvbnMgTm90QmVmb3JlPSIyMDIxLTA5LTA3VDAzOjEzOjUzLjIxMloiIE5vdE9uT3JBZnRlcj0iMjAyMS0wOS0wN1QwMzoxNDo1My4yMTJaIj48c2FtbDpBdWRpZW5jZVJlc3RyaWN0aW9uPjxzYW1sOkF1ZGllbmNlPnRlc3Qtc2FtbC1jbGllbnQ8L3NhbWw6QXVkaWVuY2U+PC9zYW1sOkF1ZGllbmNlUmVzdHJpY3Rpb24+PC9zYW1sOkNvbmRpdGlvbnM+PHNhbWw6QXV0aG5TdGF0ZW1lbnQgQXV0aG5JbnN0YW50PSIyMDIxLTA5LTA3VDAzOjEzOjU1LjIxM1oiIFNlc3Npb25JbmRleD0iMzBmMGU0NDgtY2I0OC00NTg1LWE2ZjYtY2Y0ZTQ1YTQxMjMzOjo1ZGZlZDA3MC1iNzgxLTQ2YmYtODBiYS1kMzQ4YWU1NTEzNTQiIFNlc3Npb25Ob3RPbk9yQWZ0ZXI9IjIwMjEtMDktMDdUMTM6MTM6NTUuMjEzWiI+PHNhbWw6QXV0aG5Db250ZXh0PjxzYW1sOkF1dGhuQ29udGV4dENsYXNzUmVmPnVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphYzpjbGFzc2VzOnVuc3BlY2lmaWVkPC9zYW1sOkF1dGhuQ29udGV4dENsYXNzUmVmPjwvc2FtbDpBdXRobkNvbnRleHQ+PC9zYW1sOkF1dGhuU3RhdGVtZW50PjxzYW1sOkF0dHJpYnV0ZVN0YXRlbWVudD48c2FtbDpBdHRyaWJ1dGUgTmFtZT0iUm9sZSIgTmFtZUZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmF0dHJuYW1lLWZvcm1hdDpiYXNpYyI+PHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj5kZWZhdWx0LXJvbGVzLXRlc3Q8L3NhbWw6QXR0cmlidXRlVmFsdWU+PHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj5vZmZsaW5lX2FjY2Vzczwvc2FtbDpBdHRyaWJ1dGVWYWx1ZT48c2FtbDpBdHRyaWJ1dGVWYWx1ZSB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhzaTp0eXBlPSJ4czpzdHJpbmciPm1hbmFnZS1hY2NvdW50LWxpbmtzPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI+bWFuYWdlLWFjY291bnQ8L3NhbWw6QXR0cmlidXRlVmFsdWU+PHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj52aWV3LXByb2ZpbGU8L3NhbWw6QXR0cmlidXRlVmFsdWU+PHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj50ZXN0LW9pZGMtY2xpZW50LWZhdnYtcm9sZS0xPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI+dW1hX2F1dGhvcml6YXRpb248L3NhbWw6QXR0cmlidXRlVmFsdWU+PHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj50ZXN0LW9pZGMtY2xpZW50LWZhdnYtcm9sZS0yPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI+dGVzdC1jbGllbnQtcm9sZS0yPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI+dGVzdC1jbGllbnQtcm9sZS0xPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjwvc2FtbDpBdHRyaWJ1dGU+PC9zYW1sOkF0dHJpYnV0ZVN0YXRlbWVudD48L3NhbWw6QXNzZXJ0aW9uPjwvc2FtbHA6UmVzcG9uc2U+'
}

module.exports = express.Router()
  .get('/test', async (req,res) => {
    // console.log(saml)
    try {
      const authUrl = await saml?.getAuthorizeUrlAsync() // validatePostResponseAsync (calls..., processValidlySignedPostRequestAsync)
      // console.log(authUrl)

      const parsedResponse = await saml?.validatePostResponseAsync(bodyx)
      // console.log(parsedResponse)

      res.json({ message: 'testing node-saml ok', authUrl, parsedResponse })
    } catch (e) {
      console.log(e) // , SAML_OPTIONS.privateCert
      res.status(500).json({message: 'testing node-saml error', error: e.toString()})
    }
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
    (req, res, next) => {
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 1')
      next()
    },
    passport.authenticate('saml', { session: false, failureRedirect: '/', failureFlash: true }),
    async (req, res) => {
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 2')
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
            id: req.user[samlJwtMap.id], // id: req.user.nameID, // string
            groups: req.user[samlJwtMap.groups], // groups: req.user.Role, // comma seperated string or array or object...
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

