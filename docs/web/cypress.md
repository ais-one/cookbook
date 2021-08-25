

## Install and run

```bash
npm i -D cypress
npx cypress open
```

## Linting

https://github.com/cypress-io/eslint-plugin-cypress


## Script Files

Add the code in script file for cypress autocomplete

```js
/// <reference types="cypress" />
```

Cypress uses mocha

- describe
  - before, after
  - beforeEach, afterEach
- it

## Commands

cy.log

cy.get() - one or more DOM elements by selector
default wait for 4 seconds before timeout error

