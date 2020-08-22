# Documentation

> Evolution: Extensible CRUD component for VueJS --> ExpressJS full-stack app development cookbook and recipes --> common components for multiple apps --> automated QA, test, CI/CD with Cloud container deployment

## Design Considerations

- keep technical debt in view - Rule #1 - Do Not Let Technical Debt Build Up
- keep in mind https://12factor.net/
- scalable in terms of application use cases & traffic load
- aim For simplicity, maintainability, testability, take note of size & speed
- avoid / move away from using bundlers such as Webpack, keep tooling minimal
- automated ci/cd, testing, software quality gate, devopsec, cloud, container orchestration
- modularity - reduce exposure to rewrite due to code obsolecense
- code reuse - reduce writing same code for each new application, keep code & dependencies updated
- balance dependencies use and native code
  - vee-validate from version 2 to 3 broke many things, might as well stick with HTML5 validation
  - momentjs is too big, date-fns from version 1 to 2 broke things, use native JS Date Object, Intl.DateTimeFormat, etc. instead
  - nuxt-auth could not handle 2FA or refresh token so cannot be used
- limit number of languages (e.g. use JS for everything)

## NodeJS

[nodejs.md](nodejs.md)


## Deployment And Scaling

[deployment/home.md](deployment/home.md) - WORK IN PROGRESS

## Mongo DB

[mongodb/home.md](mongodb/home.md)

## GCP

[gcp/home.md](gcp/home.md)

## VueCrudX

[VueCrudX.md](VueCrudX.md)

## Others

- Udemy Courses [courses.md](courses.md)
- E2E Testing **WIP** [cypress.md](cypress.md)
- SQA Tools [sqa-tools.md](sqa-tools.md)
- Team Guidance [team-guidance.md](team-guidance.md)




