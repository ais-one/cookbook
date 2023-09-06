# SQA NodeJS

The following development dependencies are using to assist in SQA in NodeJS

- eslint, prettier
- husky
- commitizen (to be implemented)

## ESLint & Prettier

How to get eslint and prettier to play together

### References

- https://dev.to/pixari/how-to-make-eslint-work-with-prettier-avoiding-conflicts-and-problems-57pi
- https://stackoverflow.com/questions/55481968/error-delete-cr-prettier-prettier-visual-studio-code
- https://stackoverflow.com/questions/53516594/why-do-i-keep-getting-delete-cr-prettier-prettier **RECOMMENDED**
- https://stackoverflow.com/questions/58167801/custom-eslint-rules-in-monorepo
- https://stackoverflow.com/questions/49789177/module-is-not-defined-and-process-is-not-defined-in-eslint-in-visual-studio-code

### package.json

```json
{
  "lint:older": "eslint \"src/**/*.js\"",
  "lint": "eslint . --ext .js,.vue",
  "lint:fix": "eslint . --ext .js,.vue --fix"
}
```

### install packages

```bash
npm install --save-dev eslint prettier eslint-plugin-prettier eslint-config-prettier eslint-plugin-vue@next
```

### initialize the esint config file - use JS

npx eslint --init

- To check syntax, find problems, and enforce code style
- JavaScript modules (import/export) or CJS (require)
- None of these
- TypeScript: No
- Browser or Node, as you prefer
- Use a popular style guide
- Airbnb (personally I really like this style guide)
- JavaScript
- Yes (install all dependencies)

### eslint config

```js
module.exports = {
  env: {
    ...
    node: true, // added
    ...
  },
  extends: [ ..., 'prettier'], // plugin:vue/vue3-recommended
  rules: {
    'prettier/prettier': 'error',
  },
  plugins: ['prettier'],
  ...
};
```

### prettier configs

```js
// .prettierrc.js
module.exports = {
  // trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,

  endOfLine: "auto", // added
};
```

### Other Eslint Configs and Plugins

Check if they are deprecated in newer eslint versions

- eslint-config-standard
- eslint-plugin-import
- eslint-plugin-node
- eslint-plugin-jest
- eslint-plugin-promise

## husky

Always install at root of your repo

```
npx husky-init && npm install

```

pre-commit sample file is created in .husky/pre-commit

### References

- https://typicode.github.io/husky/#/
- https://github.com/typicode/husky

## commitizen

TODO

## semantic version

TODO

# A list of Software Quality Assurance Tools

## Dependency Security

- https://snyk.io/plans/

## Code Quality Analysis

- https://sonarcloud.io/ (BEST) - https://www.sonarqube.org/ (https://github.com/ais-one/cookbook/pull/85)
- https://deepsource.io/
- https://www.veracode.com/

# CI/CD

- Github Actions
- CircleCI
- Jenkins

---

Research In Progress

## Application Performance Monitoring APM & Logging

- https://sentry.io/welcome/
- https://www.appdynamics.com/
- https://www.datadoghq.com/
- https://newrelic.com/
- https://logrocket.com/
- https://www.splunk.com/
- https://raygun.com/
- https://rollbar.com/

## User Behaviour Analysis

Analyze user behavior across your sites and apps

- MixPanel https://mixpanel.com/home/
- Google Analytics

# CI/CD - Gitlab Auto Devops

- https://gitlab.com/help/topics/autodevops/index.md
- https://www.gitlab.com/help/user/application_security/sast/index.md
- https://github.com/ajinabraham/NodeJsScan - SAST
- https://github.com/zaproxy/zaproxy - DAST
- https://prometheus.io/ - monitoring

## References

### console.log

- https://stackoverflow.com/questions/7042611/override-console-log-for-production/21789576
- https://ourcodeworld.com/articles/read/104/how-to-override-the-console-methods-in-javascript
- https://gist.github.com/pincheira/2724082
- https://stackoverflow.com/questions/63075459/override-console-log-method-without-losing-the-original-stack-javascript
