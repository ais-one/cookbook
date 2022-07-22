# Playwright (preferred)

https://www.lambdatest.com/blog/playwright-framework/


# Cypress

## Install and run

```bash
npm i -D cypress
npx cypress open
npx cypress run --browser chrome --spec "cypress/integration/secondTest.spec.js"
```

## Linting

https://github.com/cypress-io/eslint-plugin-cypress


## Script Files

Add the code in script file for cypress autocomplete

```js
/// <reference types="cypress" />
```

### Notes

Cypress uses mocha

- describe
  - before, after
  - beforeEach, afterEach
- it

cy.log

cy.get() - one or more DOM elements by selector

default wait for 4 seconds before timeout error

## Commands

Useful for creating custom cypress commands to be called in tests to reduce repeats

https://docs.cypress.io/api/table-of-contents

https://docs.cypress.io/guides/references/best-practices

### Assertions

https://docs.cypress.io/guides/references/assertions

### Alerts Confirm Prompt

- https://applitools.com/blog/testing-browser-alerts-confirmations-prompts-cypress/
- https://chercher.tech/cypress-io/alerts-popups-cypressio
- https://www.tutorialspoint.com/handling-alerts-with-cypress

### Working With SPA

https://stackoverflow.com/questions/51122303/implement-login-command-and-access-vuex-store

At Vuex creation code:

```js
const store = new Vuex.Store({...})

// Cypress automatically sets window.Cypress by default
if (window.Cypress) {
  window.__store__ = store
}
```

Cypress test code:

```js
cy.visit()
// wait for the store to initialize
cy.window().should('have.property', '__store__')

cy.window().then( win => {
  win.__store__.dispatch('myaction')
})
```

### Component Testing
https://www.vuemastery.com/conferences/vueconf-us-2021/component-testing-with-vite-vue-and-cypress/
https://docs.cypress.io/guides/component-testing/introduction
https://github.com/JessicaSachs/cypress-loves-vite


### Visual Regression Testing

N.A.

### CI/CD

https://docs.cypress.io/guides/continuous-integration/introduction

## Official Examples
- https://github.com/cypress-io/cypress-realworld-app
- https://github.com/cypress-io/cypress-example-kitchensink
- https://github.com/cypress-io/cypress-example-recipes
