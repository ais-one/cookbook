# Documentation

> Evolution: Extensible CRUD component for VueJS --> ExpressJS full-stack app development cookbook and recipes --> common components for multiple apps --> automated QA, test, CI/CD with Cloud container deployment

## Design Considerations

- keep technical debt in view - Rule #1 - Do Not Let Technical Debt Build Up
- keep in mind https://12factor.net/
  - Logging (Use APM instead?) - use console.log & morgan
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

## JS Native Libraries
- Intl
- Fetch
- Date
- Canvas
- WebGL

## Documents

- Backend
  - Kafka [backend/kafka.md](backend/kafka.md)
  - MicroServices [backend/micro-services.md](backend/micro-services.md)
  - TCP [backend/tcp.md](tcp.md)
  - Mongo DB [backend/mongodb/home.md](backend/mongodb/home.md)
- Deployment And Scaling
  - Deployment [deployment/home.md](deployment/home.md)
  - Deployment Container [deployment/deployment-container.md](deployment/deployment-container.md)
  - Deployment VM [deployment/deployment-vm.md](deployment/deployment-vm.md)
  - Deployment Secrets[deployment/secrets.md](deployment/secrets.md)
- GCP
  - Home [gcp/home.md](gcp/home.md)
- SQA
  - E2E Testing [sqa/e2e.md](sqa/e2e.md)
  - SQA Tools [sqa/sqa-tools.md](sqa/sqa-tools.md)
  - SQA NodeJS [sqa/sqa-nodejs.md](sqa/sqa-nodejs.md)
  - Team Guidance [sqa/team-guidance.md](sqa/team-guidance.md)
- Web
  - Authentication [web/authentication.md](web/authentication.md)
  - Custom Elements [web/custom-element.md](web/custom-element.md)
  - Fetch API [web/fetch.md](web/fetch.md)
  - GraphQL [web/graphql.md](web/graphql.md)
  - JS [web/js.md](web/js.md)
  - Performance [web/performance.md](web/performance.md)
  - Logging [web/logging.md](web/logging.md)
- Git [git.md](git.md)
- NodeJS [nodejs.md](nodejs.md)
- Udemy Courses [courses.md](courses.md)
- k8s [kubernetes YAML files (WIP)](k8s)
