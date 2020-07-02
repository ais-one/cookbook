/// <reference types="cypress" />

// const { verify } = require("cypress/types/sinon")

// npx cypress open

// beforeAll(() => { })
// afterAll(() => { })

describe('my first test suite', () => {
  // describe('my first sub test suite', () => {
  //   beforeEach('beforeEach', () => {
  //   })
  //   afterEach('afterEach', () => {
  //   })

  //   it('first sub test', () => {
  //   })
  // })

  // it('first test', () => {
  //   cy.visit('/')
  //   cy.contains('Forms').click()
  //   cy.contains('Form Layouts').click()

  //   // by tag name
  //   cy.get('input')

  //   // by Id
  //   cy.get('#inputEmail1')

  //   // by Class name
  //   cy.get('.input-full-width')

  //   // by attribute name
  //   cy.get('[placeholder]')

  //   // by attribute name and value
  //   cy.get('[placeholder="Email"]')

  //   // by Class value
  //   cy.get('[class="input-full-width size-medium shape-rectangle"]')

  //   // by tag name and attribute with value
  //   cy.get('input[placeholder="Email"]')

  //   // by 2 different attibutes
  //   cy.get('[placeholder="Email"][fullwidth][type="email"]')

  //   // by tag name and attribute with value, id, class name
  //   cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')

  //   // recommended way
  //   cy.get('[data-cy="imputEmail1"]')
  // })

  // it('second test', () => {
  //   cy.visit('/')
  //   cy.contains('Forms').click() // only one element
  //   cy.contains('Form Layouts').click()
    
  //   cy.get('[data-cy="signInButton"]')
  //   cy.contains('Sign in')
  //   cy.contains('[status="warning"]','Sign in')

  //   cy.get('#inputEmail3').parents('form')
  //     .find('button') //  find child from parent
  //     .should('contain', 'Sign in')
  //     .parents('form').find('nb-checkbox').click()

  //   cy.contains('nb-card', 'Horizontal form') // tag nb-card contains text "Horizontal form"
  //     .find('[type="email"]')
  // })

  it('then and wrap methods', () => { //  async here can cause problems
    cy.visit('/')
    cy.contains('Forms').click() // only one element
    cy.contains('Form Layouts').click()

    // cannot do this...
    // const xx = cy.contains('nb-card', 'Using the Grid')

    // cy.contains('nb-card', 'Using the Grid')
    //   .find('[for="inputEmail1"]')
    //   .should('contain', 'Email')

    // cy.contains('nb-card', 'Using the Grid')
    //   .find('[for="inputPassword2"]')
    //   .should('contain', 'Password')

    // cy.contains('nb-card', 'Basic form')
    //   .find('[for="exampleInputEmail1"]')
    //   .should('contain', 'Email address')

    // cy.contains('nb-card', 'Basic form')
    //   .find('[for="exampleInputPassword1"]')
    //   .should('contain', 'Password')

    cy.contains('nb-card', 'Using the Grid').then( firstForm => {
      const emailLabelFirst = firstForm.find('[for="inputEmail1"]').text() // jQuery format
      const passwordLabelFirst = firstForm.find('[for="inputPassword2"]').text() // jQuery format
      expect(emailLabelFirst).to.equal('Email') // use chai library
      expect(passwordLabelFirst).to.equal('Password') // use chai library

      cy.contains('nb-card', 'Basic form').then( secondForm => {
        const passwordSecondText = secondForm.find('[for="exampleInputPassword1"]').text() // jQuery format
        expect(passwordLabelFirst).to.equal(passwordSecondText) // use chai library

        cy.wrap(secondForm).find('[for="exampleInputPassword1"]').should('contain', 'Password') //  convert jQuery to Cypress
      })
    })
  })

  it('invoke command', () => { //  async here can cause problems
    cy.visit('/')
    cy.contains('Forms').click() // only one element
    cy.contains('Form Layouts').click()

    // 1
    cy.get(('[for="exampleInputEmail1"]')).should('contain', 'Email address')

    // 2
    cy.get(('[for="exampleInputEmail1"]')).then(label => {
      expect(label.text()).to.equal('Email address')
    })

    // 3
    cy.get(('[for="exampleInputEmail1"]')).invoke('text').then(text => {
      expect(text).to.equal('Email address')
    })

    // 4
    cy.contains('nb-card', 'Basic form')
      .find('nb-checkbox')
      .click()
      .find('.custom-checkbox')
      .invoke('attr', 'class')
      // .should('contain', 'checked')
      .then(classValue => { //using jQuery & chai
        expect(classValue).to.contain('checked')
      })
  })

  it('assert property', () => {
  
    function selectDayFromCurrent(day) {
      let date = new Date()
      date.setDate(date.getDate() + day)
      let futureDay = date.getDate()
      let futureMonth = date.toLocaleString('default', { month: 'short' })
      let dateAssert = futureMonth + ' ' + futureDay + ', ' + date.getFullYear()
  
      cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then(dateAttribute => {
        if (!dateAttribute.includes(futureMonth)) {
          cy.get('[data-name="chevron-right"]').click()
          selectDayFromCurrent(day)
          // cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]').contains(futureDay).click()
        } else {
          cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]').contains(futureDay).click()
        }
      })
      return dateAssert
    }

    cy.visit('/')
    cy.contains('Forms').click() // only one element
    cy.contains('Datepicker').click()


    cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
      cy.wrap(input).click()

      let dateAssert = selectDayFromCurrent(70)
      cy.wrap(input).invoke('prop', 'value').should('contain', dateAssert)
      cy.wrap(input).should('have.value', dateAssert) // SAME AS ABOVE
  
      // cy.get('nb-calendar-day-picker').contains('17').click()
      // cy.wrap(input).invoke('prop', 'value').should('contain', '17')
    })
  })

  it('radio button', () => {
    cy.visit('/')
    cy.contains('Forms').click() // only one element
    cy.contains('Form Layouts').click()

    cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then(rb => {
      cy.wrap(rb).first().check({force: true}).should('be.checked')

      cy.wrap(rb).eq(1).check({force: true}).should('be.checked') // second radio button (0 based index)
      cy.wrap(rb).first().should('not.be.checked')
      cy.wrap(rb).eq(2).should('be.disabled')
    })
  })

  it('check boxes', () => {
    cy.visit('/')
    cy.contains('Modal & Overlays').click() // only one element
    cy.contains('Toastr').click()

    // cy.get('[type="checkbox"]').check({force: true}) // it checks all
    cy.get('[type="checkbox"]').eq(0).click({force: true})
    cy.get('[type="checkbox"]').eq(1).check({force: true})
  })

  it('lists and dropdowns', () => {
    cy.visit('/')

    // 1
    // cy.get('nav nb-select').click()
    // cy.get('.options-list').contains('Dark').click()
    // cy.get('nav nb-select').should('contain', 'Dark')
    // cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(34, 43, 69)')

    // 2
    cy.get('nav nb-select').then(dd => {
      cy.wrap(dd).click()
      cy.get('.options-list nb-option').each((item, index) => { // loop
        const itemText = item.text().trim() // jQuery

        const colors = {
          "Light": "rgb(255, 255, 255)",
          "Dark": "rgb(34, 43, 69)",
          "Cosmic": "rgb(50, 50, 89)",
          "Corporate": "rgb(255, 255, 255)",
        }
        cy.wrap(item).click()
        cy.wrap(dd).should('contain', itemText)
        cy.get('nb-layout-header nav').should('have.css', 'background-color', colors[itemText])
        if (index < 3) {
          cy.wrap(dd).click()
        }
      })
    })

    // can use cy.select only if tag is select
  })

  it('web tables', () => {
    cy.visit('/')
    cy.contains('Tables & Data').click()
    cy.contains('Smart Table').click()

    // edit
    cy.get('tbody').contains('tr', 'Larry').then(row => {
      cy.wrap(row).find('.nb-edit').click()
      cy.wrap(row).find('[placeholder="Age"]').clear().type('25') // need to clear
      cy.wrap(row).find('.nb-checkmark').click()
      cy.wrap(row).find('td').eq(6).should('contain', '25')
    })

    // add
    cy.get('thead').find('.nb-plus').click()
    cy.get('thead').find('tr').eq(2).then(row => {
      cy.wrap(row).find('[placeholder="First Name"]').type('A First Name')
      cy.wrap(row).find('[placeholder="Last Name"]').type('A Last Name')
      cy.wrap(row).find('.nb-checkmark').click()
    })
    cy.get('tbody tr').first().find('td').then(col => {
      cy.wrap(col).eq(2).should('contain', 'A First Name')
      cy.wrap(col).eq(3).should('contain', 'A Last Name')
    })

    // filters
    const ages = [20, 30, 40, 200]
    cy.wrap(ages).each(age => {
      cy.get('thead [placeholder="Age"]').clear().type(age) // need to clear
      cy.wait(500)
      cy.get('tbody tr').each(row => {
        if (age === 200) {
          cy.wrap(row).should('contain', 'No data found')
        } else {
          cy.wrap(row).find('td').eq(6).should('contain', age)
        }
      })  
    })
  })

  it('tooltip', () => {
    cy.visit('/')
    cy.contains('Modal & Overlays').click()
    cy.contains('Tooltip').click()

    cy.contains('nb-card', 'Colored Tooltips').contains('Default').click()
    cy.get('nb-tooltip').should('contain', 'This is a tooltip')
  })

  it.only('dialog box', () => {
    cy.visit('/')
    cy.contains('Tables & Data').click()
    cy.contains('Smart Table').click()


    // Method 1
    // cy.get('tbody tr').first().find('.nb-trash').click()
    // cy.on('window:confirm', (confirm) => {
    //   expect(confirm).to.equal('Are you sure you want to delete?')
    // })

    // Method 2 - cleaner if confirm message is not coded
    // const stub = cy.stub()
    // cy.on('window:confirm', stub)
    // cy.get('tbody tr').first().find('.nb-trash').click().then(() => {
    //   expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
    // })

    // Cancel
    cy.get('tbody tr').first().find('.nb-trash').click()
    cy.on('window:confirm', () => false)
  })
})

// describe('my second test suite', () => {
//   it('first test', () => {

//   })
//   it('second test', () => {
    
//   })
// })