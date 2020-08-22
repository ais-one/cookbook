
# Technical Debt Reduction

- try to use as little libraries/dependencies as possible

- use native NodeJS or Javascript
  - vee-validate from version 2 to 3 broke many things, might as well stick with HTML5 validation
  - momentjs is too big, date-fns from version 1 to 2 broke things, use native JS Date Object, Intl.DateTimeFormat, etc. instead
  - nuxt-auth could not handle 2FA or refresh token so cannot be used

## Design Considerations

> Always Remember Rule #1 - Do Not Let Technical Debt Build Up

- keep technical debt in view
- keep in mind https://12factor.net/
- scalable in terms of application use cases & traffic load
- ease of development, maintenance, updates, build, test, integration, delivery, deployment, etc.
- size, speed, modularity (e.g. micro services)
- limit number of languages (e.g. use JS for everything) and dependency usage
- go native, reduce dependency, balance use of native code vs libraries
- avoid / move away from using bundlers such as web pack, keep tooling minimal
- automated testing, ci/cd, devopsec, cloud, container orchestration
- aiming For Simplicity, Maintainability, Testability

## CRUD Unique Selling Points

The following differentiates vue-crud-x from other CRUD repositories:
- Able to do nested CRUD operations (parent table call child table),
- Server side pagination, sorting & filtering
- Handle infinite scroll use-case
- Handle authentication tokens, user permissions
- Customise table, search filter, CRUD form, validation, CRUD operations (call REST, GraphQL, etc.)
- Auto-configure/generate Search filter and CRUD Forms using JSON
- Inline edit (row level)
- Export to CSV/JSON, File/Image Upload
- Reload & optimization strategy
- Overridable methods with default behaviour
- Emitted events for use by parent component
- Real-time updates & subscription

Other design considerations :
- i18n, l10n a11y
- Tree shaking, Lazy loading, Performance
- Implementation with multiple UI frameworks
  - remove as many UI framework dependent parts as possible
  - indacate parts which should change if other UI frameworks are used 
- Cleaner code with correct use of RxJS, async/await/Promises


# NodeJS

[nodejs.md](nodejs.md)


# Deployment And Scaling

[deployment/home.md](deployment/home.md) - WORK IN PROGRESS

# Mongo DB

[mongodb/home.md](mongodb/home.md)

# GCP

[gcp/home.md](gcp/home.md)

# VueCrudX

[VueCrudX.md](VueCrudX.md)

# Others

[courses.md](courses.md)
**WIP** [cypress.md](cypress.md)
[sqa-tools.md](sqa-tools.md)
[team-guidance.md](team-guidance.md)




