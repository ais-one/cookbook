export const visitPage = (path) => cy.visit('http://127.0.0.1:8080/' + path)

export const loginWithAPI = () => {
  cy.request({
    method: 'POST',
    url: 'http://127.0.0.1/api/auth/otp',
    body: {
      id: 1,
      pin: '111111'
    }
  }).then((res) => {
    // TBB possible to set vuex state? or set res cookie?
    // res.body.access_token
    // res.body.refresh_token
  })
}
