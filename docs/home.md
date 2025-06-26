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

- Intl, Fetch, Date, Canvas, WebGL

## Documents

- Backend (Kafka. Microservices?, TCP) [backend.md](backend.md)
- Cloud [cloud.md](cloud.md)
- 
- Deployment And Scaling [deployment.md](deployment.md)
- Dev Tooling & Setup [devtools.md](devtools.md)
- Git [git.md](git.md)
- JS [web/js.md](web/js.md)
- NodeJS [nodejs.md](nodejs.md)
- NodeJS SQA [nodejs-sqa.md](nodejs-sqa.md)
- Python [python.md](python.md)
- Team Guidance [team-guidance.md](team-guidance.md) - processes, standards, devtools
- Web [web.md](web.md) - covers custom el, fetch, performance, logging, authentication
- VueJS [vue.md](vue.md) - VueJS related item

## Scaling Your Development

- https://www.aspecto.io/blog/lerna-hello-world-how-to-create-a-monorepo-for-multiple-node-packages/
- https://medium.com/@anoop_gupta/cross-repository-component-sharing-using-mono-repo-multi-packages-architecture-2797c3e02c6c

- https://www.codemzy.com/blog/nodejs-file-folder-structure
