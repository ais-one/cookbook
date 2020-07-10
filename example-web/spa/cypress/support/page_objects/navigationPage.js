function selectGroupMenuItem(groupMenu) {
    // cy.contains(groupMenu).click()
    cy.contains('a', groupMenu).then(menu => {
    cy.wrap(menu).find('.expand-state g g').invoke('attr', 'data-name').then(attr => {
      if (attr.includes('left')) {
        cy.wrap(menu).click()
      }
    })
  })

}

export class NavigationPage {

  formLayoutPage () {
    selectGroupMenuItem('Form')
    cy.contains('Form Layouts').click()
  }

  datepickerPage () {
    selectGroupMenuItem('Form')
    cy.contains('Datepicker').click()
  }

  toasterPage () {
    selectGroupMenuItem('Modal & Overlays')
    cy.contains('Toastr').click()
  }
  smartTablePage () {
    selectGroupMenuItem('Tables & Data')
    cy.contains('Smart Table').click()
  }
  tooltipPage () {
    selectGroupMenuItem('Modal & Overlays')
    cy.contains('Tooltip').click()
  }
}

export const navigateTo = new NavigationPage()
