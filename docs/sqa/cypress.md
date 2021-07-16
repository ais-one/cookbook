# Cypress - WIP

## Installation & Running Commands

```bash
npm i -D cypress
npx cypress open
npx cypress run
npx cypress run --browser chrome
npx cypress run --spec "cypress/integration/secondTest.spec.js"
```

cypress.json file

```json
{
  "baseUrl": "http://localhost:4200",
  "ignoreTestFiles": "**/examples/*",
  "viewportHeight": 1080,
  "viewportWidth": 1920,
  "video": false,
}
```

## Official Examples
- https://github.com/cypress-io/cypress-realworld-app
- https://github.com/cypress-io/cypress-example-kitchensink
- https://github.com/cypress-io/cypress-example-recipes

## Udemy Course (To Remove)
- https://github.com/Postavshik/ngx-cypress-test
- https://github.com/gothinkster/angular-realworld-example-app



npm i start-server-and-test

"serve": "vue-cli-service serve --port 8080",
"cypress:run": "npx cypress run"
start-test serve http-get://localhost:PORT cypress:run


npm i -D cypress-plugin-retries

cypress/support/index.js
require('cypress-plugin-retries') // at the top

cypress/plugins/index.js:
module.exports = (on, config) => {
  require('cypress-plugin-retries/lib/plugin')(on)
}

// global retries
// CYPRESS_RETRIES=2 npm run cypress
// cypress.json
  "env": { // global retries
    "RETRIES": 2
  }
// per test retries
it('test', () => {
    Cypress.currentTest.retries(2)
})


cypress-plugin-snapshots
sorry-cypress

https://percy.io/

