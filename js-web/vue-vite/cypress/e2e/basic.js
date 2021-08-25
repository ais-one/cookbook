/// <reference types="cypress" />

describe('Login feature test', () => {
  it('should visit the login page correctly', () => {
    // NOSONAR
    // const screens = ['iphone-5', 'macbook-15']
    // cy.viewport(500, 750) // cy.viewport('macbook-15')
    // cy.viewport('iphone-5')
    // cy.visit('https://example.cypress.io')
    cy.visit('/cypress/index.html')
    /* NOSONAR
    // SELECTORS

    // cy.get() .header1.main #header-1

    // cy.get('.list1')

    // cy.get('.course-list>.list1')
    //  .should('have.text', 'Cypress')

    // cy.get('.course-list')
    //  .should('contain', 'Cypress')

    // cy.get('.course-list').children('.list1') // direct children

    cy.get('.course-container .list1', {
      timeout: 10000
    })
    cy.get('.course-container>.list1') // error
    cy.get('.course-container').find('.list') // can find children which are not direct children

    cy.get('li').first()
    cy.get('li').last()
    cy.get('li').eq(1) // 0 based index

    cy.get('li').filter('.web')

    cy.get('li').next() // get direct next sibling
    cy.get('li').nextAll().first()
    cy.get('li').nextUntil('.list7').first()

    // prev
    // prevAll
    // prevUntil

    // find using text
    cy.contains('Selenium') // not encouraged

    // find using attributes
    cy.get('[attribute="value1"]') // '[data-cy="some palce"]'


    // EVENTS
    cy.get('.invoices-button').first().click('center', {
      multiple: false, // click on multiple elements,
      force: false // set true to click button covered by another element
    }) // click on element
    // rightclick(), dblclick()

    cy.get('#inputEmail').type('test@test.com') // .clear() to remove text
    cy.get('#inputPassword').type('test@test.com')
    cy.get('[name="coveredIput]]').type('hello', {
      delay: 100, // wait 100ms after typing each character
      force: true
    })

    cy.get('#courses').select('course2') // value
    cy.get('#courses').select('selenium') // text

    cy.get('#Banana').check() // uncheck

    cy.get('[type="checkbox"]').check() // check all
    cy.get('[type="checkbox"]').check(['Banana', 'Fries']) // check a few

    cy.get('.magic-input').focus()
    cy.get('.magic-input').blur()

    cy.get('.invoice-button').first().trigger('click') // mouseover, mouseout, mousedown, mouseup

    // mousedown
    cy.get('.invoice-button').first().trigger('mousedown')
    cy.wait(5000)
    cy.get('.invoice-button').first().trigger('mouseup')

    // SHOULD
    cy.get('.list10').should('not.be.visible')
    cy.get('#detox').should('have.class', 'mobile')
    cy.get('.trigger-button').trigger('mouseover').should('have.css', 'background-color', 'rgb(255, 0, 0)')

    cy.get('#inputEmail').should('be.enabled') // input enabled or disabled? //  readonly?
    cy.get('.random-image').should('have.attr', 'src', '........')

    cy.get('#inputEmail').type('aaa').should('have.value', 'aaa')
    // should...  be... selected / focused / checked

    // COMMANDS
    cy.url().should('contain', 'index.html')
    cy.title().should('eql', 'some title') // get page title
    cy.go('back') // forward
    */
  })
})

// find vs children
