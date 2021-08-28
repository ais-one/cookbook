/// <reference types="cypress" />

describe('The Home Page', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8080')
  })

  it('login', () => {
    cy.get('[data-cy="layout-public"]').should('exist') // wait for public layout to be exist
    cy.get('[data-cy="layout-secure"]').should('not.exist')
    cy.get('[data-cy=username]').clear().type('test')
    cy.get('[data-cy=password]').clear().type('test')
    cy.get('[data-cy=login]').click()

    cy.get('[data-cy=pin]').should('be.visible') // we are at OTP
    cy.get('[data-cy=pin]').clear().type('111111')
    cy.get('[data-cy=otp]').click()

    cy.url().should('contain', '/dashboard')

    cy.get('[data-cy="layout-secure"]').should('exist') // wait for secure to be exist
    cy.get('[data-cy="layout-public"]').should('not.exist')
    cy.get('[data-cy="view-dashboard"]').should('have.class', 'container') // we are at dashboard

    cy.get('[data-submenu-id="visuals"]').click()
    cy.get('[data-menu-id="/visuals/chart2"]').click()
    cy.get('#c2').should('exist')
    cy.get('#c2').children().should('have.length', 1) // wait for chart to load
    cy.get('#c3').should('exist')
    cy.get('#c3').children().should('have.length', 1) // wait for chart to load

    cy.get('[data-cy=logout]').click()
    cy.url().should('contain', '/signin')

    // NOSONAR
    // cant use these for SPA
    // cy.location('pathname').should('match', /\/dashboard$/)
    // cy.location('pathname').should('eq', '/dashboard')
    // cy.url().should('eq', 'http://127.0.0.1:8080/dashboard')

    // TBD check alert popup
  })
})
