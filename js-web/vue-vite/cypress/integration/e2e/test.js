/// <reference types="cypress" />

describe('Login feature test', () => {
  // beforeEach(() => {
  // })

  it('GET test', () => {
    // ASYNC
    // let currentURL = ''
    // cy.visit(testSite)
    // cy.url().then((url) => {
    //   currentURL = url
    //   expect(currentURL).to.contains('index.html')
    // })
    // // ALIAS / VARIABLES
    // cy.url().as('myurl') // Alias only valid for this test, use beforeEach if you want it available for all tests, use this.myurl in the case & cannot use arrow functions
    // cy.get('@myurl')

    cy.request({
      method: 'GET',
      url: 'https://httpbin.org/get?test-param=1',
      qs: { id: 1 }
    }).then((res) => {
      cy.log(res.statusText)
      cy.log(res.duration)
      cy.log(res.headers)
      cy.log(res.body)
      expect(res.status).to.be.eq(200)
      expect(res.duration).to.be.below(20000)
    })
  })

  it('POST test', () => {
    cy.request({
      method: 'POST',
      url: 'https://httpbin.org/post',
      // qs: { id: 1 },
      body: { abc: 123 }
    }).then((res) => {
      expect(res.status).to.be.eq(200)
      expect(res.duration).to.be.below(20000)
    })
  })

  it.only('healthcheck auth test', () => {
    cy.request({
      method: 'POST',
      url: 'https://127.0.0.1:3000/api/health-auth',
      auth: {
        bearer: ''
      }
    }).then((res) => {
      expect(res.status).to.be.eq(200)
      expect(res.duration).to.be.below(20000)
    })
  })

})
