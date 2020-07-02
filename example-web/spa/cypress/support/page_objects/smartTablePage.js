export class smartTablePage {

  updateAgeByFirstName (name, age) {
    cy.get('tbody').contains('tr', name).then(row => {
      cy.wrap(row).find('.nb-edit').click()
      cy.wrap(row).find('[placeholder="Age"]').clear().type(age) // need to clear
      cy.wrap(row).find('.nb-checkmark').click()
      cy.wrap(row).find('td').eq(6).should('contain', age)
    })
  }

  addNewRecordWithFirstAndLastName (firstName, lastName) {
    cy.get('thead').find('.nb-plus').click()
    cy.get('thead').find('tr').eq(2).then(row => {
      cy.wrap(row).find('[placeholder="First Name"]').type(firstName)
      cy.wrap(row).find('[placeholder="Last Name"]').type(lastName)
      cy.wrap(row).find('.nb-checkmark').click()
    })
    cy.get('tbody tr').first().find('td').then(col => {
      cy.wrap(col).eq(2).should('contain', firstName)
      cy.wrap(col).eq(3).should('contain', lastName)
    })
  }

  deleteRowByIndex(index) {
    const stub = cy.stub()
    cy.on('window:confirm', stub)
    cy.get('tbody tr').eq(index).find('.nb-trash').click().then(() => {
      expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
    })
  }
}

export const onSmartTablePage = new smartTablePage()
