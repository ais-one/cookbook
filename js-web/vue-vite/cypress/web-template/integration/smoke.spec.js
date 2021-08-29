/// <reference types="cypress" />
import * as signInPage from '../pages/signin'
import * as layoutSecure from '../pages/layoutSecure'
import * as demoChartsPage from '../pages/Visuals/DemoChart2'

describe('Do smoke test on UI', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8080')
  })

  it('login', () => {
    signInPage.fieldUsername().clear().type('test')
    signInPage.fieldPassword().clear().type('test')
    signInPage.buttonLogin().click()

    signInPage.fieldPin().should('be.visible') // we are at OTP
    signInPage.fieldPin().clear().type('111111')
    signInPage.buttonOtp().click()

    cy.url().should('contain', '/dashboard') // we are at dashboard

    layoutSecure.subMenu('visuals').click()
    layoutSecure.menu('/visuals/chart2').click()

    demoChartsPage.chart2().should('exist')
    demoChartsPage.chart2().children().should('have.length', 1) // wait for chart to load
    demoChartsPage.chart3().should('exist')
    demoChartsPage.chart3().should('have.length', 1) // wait for chart to load
    cy.url().should('contain', '/visuals/chart2')

    layoutSecure.buttonLogout().click()
    cy.url().should('contain', '/signin') //  we are back at signin

    // NOSONAR
    // cy.location('pathname').should('match', /\/dashboard$/) // cant use these for SPA
    // cy.location('pathname').should('eq', '/dashboard')
    // cy.get('[data-cy="layout-public"]').should('not.exist') // for detecting non-existent

    // TBD check alert popup
  })
})
