export const fieldUsername = () => cy.get('[data-cy=username]')
export const fieldPassword = () => cy.get('[data-cy=password]')
export const buttonLogin = () => cy.get('[data-cy=login]')

export const fieldPin = () => cy.get('[data-cy=pin]')
export const buttonOtp = () => cy.get('[data-cy=otp]')

// use this if logging in as different user role
export const performLogin = (username, password) => {
  fieldUsername().clear().type(username)
  fieldPassword().clear().type(password)
  buttonLogin().click()
}