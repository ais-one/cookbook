import { navigateTo } from '../support/page_objects/navigationPage'
import { onFormLayoutsPage } from '../support/page_objects/formLayoutsPage'
import { onDatepickerPage } from '../support/page_objects/datepickerPage'
import { onSmartTablePage } from '../support/page_objects/smartTablePage'



describe('Test with page object', () => {
  beforeEach('open application', () => {
    cy.openHomePage() // created as a custom command in commands.js
    // cy.visit('/')
  })

  it ('verify navigation across the pages', () => {
    navigateTo.formLayoutPage()
    navigateTo.datepickerPage()
    navigateTo.toasterPage()
    navigateTo.smartTablePage()
    navigateTo.tooltipPage()
  })

  it.only('should submit Inline and Basic form and select tomorrow date in the calendar', () => {
    // navigateTo.formLayoutPage()
    // onFormLayoutsPage.submitInlineFormWithNameAndEmail('Aaron', 'test@test.com')
    // onFormLayoutsPage.submitBasicFormWithNameAndEmail('test@test.com', 'password')
    // navigateTo.datepickerPage()
    // onDatepickerPage.selectCommonDatepickerDateFromToday(1)
    // onDatepickerPage.selectDatepickerWithRangeFromToday(7, 14)
    navigateTo.smartTablePage()
    onSmartTablePage.addNewRecordWithFirstAndLastName('aaronix', 'gong')
    onSmartTablePage.updateAgeByFirstName('aaronix', 80)
    onSmartTablePage.deleteRowByIndex(1)
  })
})