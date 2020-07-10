### Version 0.3.3
- [chore] update packages & cleanup & work on improving documentation
- [Work-in-progress]
  - circleci workflow
    - deploy backend to GCP Cloud Run
    - deploy SPA frontend to GCP Storage
  - backend
    - GKE, Kubernetes
    - generic table crud frontend
  - frontend
    - generic table crud backend
    - cypress e2e testing
    - Preparing for VueJS 3

### Ongoing
- [TODO]
  - backend
    - add kafka working example
    - research websocket testing, improve coverage
    - research auto generated REST API and Testing (keep in view dredd.io)
    - JsonSchema
  - frontend
    - Handle/Test Signature & Webcam input
    - Remove date-fns library and use native JS libraries for handling date, time
    - explore use of fetch API instead of axios (abort fetch, etc)
    - PWA cookbook (many things to consider)
    - web components or no bundler required UI framework, also make code more framework agnostic
    - ant design version (kiv until web components / more UI framework agnostic code is implemened)
  - others
    - Make ES module build (only possible when UI framework e.g. Vuetify has ES module version)
    - Should we change Vuex action setLayout to setPublic and setSecure?
    - graphql security & performance review
- [Findings]
  - Logging (Use APM instead?) - use console.log & morgan
  - use native html5 validation rather than Vuelidate / Vee-validate (major version changes is painful)

### Version 0.3.2
- [chore] update packages & cleanup & work on improving documentation
- make it CI/CD friendly [re-organized folders again...]
- renamed common-app to common-lib and it contain reusable stuff
- use NodeJS globals for CONFIG, LIB_PATH, APP_PATH, APP_NAME
- long running process support such as tcp servers
- cronjobs (better that cron call an API rather than run code)
- deployment
  - Small scale - all in one server - vm, pm2, SSH (express also serves the frontend)
  - Medium to large
    - Frontend deploy to GCP Storage / AWS S3 etc.
    - Backend as docker container, Google Cloud Run

### Version 0.3.1
- update packages & cleanup
- work on improving documentation
- example-app/web/vite
  - add vite and do sample composition api
- example-app/web/spa
  - removed Ant Design (look to using web components or something that does not use bundler)
  - fixed run run  build
- example-app/web/pwa
  - add a pwa sample app
  - add Firebase Cloud Messaging (FCM) push notification
- example-app/public/demo-nobundler
  - add no bundler implementation of Vue SPA using ES Modules
- common-app
  - add telegram - send to group or channel via bot
  - add FCM push notification
  - improved on error handling (less boilerplate, see example-app/router/api.js)
- example-app
  - improved router organization, and auth
  - clear httponly cookie on logout
- vue-crud-x
  - fixed sorting
  - fixed graphql example to include pagination
  - fixed infinite scroll bug
  - fixed code to work with latest vuetify (2.2.15 onwards) and fix infinite scroll double xhr call on filter button press
  - cleanup code
  - update build

### Version 0.3.0
- update packages
- re-architect for better scalability - able to use as base for multiple full-stack applications
- /backend moved to /, folders are reorganized... refer to README.md Project Structure for more details
- backend
  - switch app builds based on settings in /package.json config.app property
  - improve error handling using error handler middleware (see /api/error endpoint)
  - clean up auth, add groups to JWT and others, also affects frontend
  - logging using morgan only, no winston, console.log is sufficient (also see https://12factor.net/)
  - add file upload to GCP storage using signed Urls (alternative vendors include AWS S3 or Azure Storage)
  - add Dockerfile see docs/Containers.md & example-app/Dockerfile & example-app/.dockerignore
  - add message queue example using agenda /api/mq (requires MongoDB) & bull /api/mq-bull (requires Redis)
- frontend /example-app/web folder hosts examples for SPA, SSR
  - update user replace loginType with groups (ADFS SAML claims, etc), improve on permissions handling
  - avoid single vendor lock in - remove mongo switch and firebase

### Version 0.2.8
- update packages
  - remove date-fns (use Native JS Intl.DateTimeFormat and Date objects)
- VueCrudX
  - fix table height (footer with pagination was hidden)
  - enhance render: cell content formatting of the column (if column name is found, value passed in is cell value, else value passed in is row values object)
- backend
  - add jest test, create unit and integration test
  - structure backend to be testable, create controllers
  - allow to authorize from cookie or header
- example-spa
  - fixed axios.js, error.config.url returns only path instead of full url in updated version of axios (affected refresh token)

### Version 0.2.7
- skipped pushed 0.2.6 to npm as 0.2.7

### Version 0.2.6
- update packages
  - objection upgraded to version 2 - breaking changes...
    - eager -> withGraphFetched
    - modifyEager -> modifyGraph
    - joinRelated -> joinRelation
- fixed issue https://stackoverflow.com/questions/59006130/error-typeerror-cannot-read-property-match-of-undefined

### Version 0.2.5
- update packages
  - vue-cli v4, eslint v6, and many other packages
  - replaced buggy http-server package with serve package (https://github.com/http-party/http-server/issues/525)
- backend
  - example of using RS256 for secret key (sample cert and key are in the certs folder)
  - rename api route /api/rest-test to /api/health, serves as health check, add /api/health-auth to test auth routes
  - add IP address checking (you can IP from req.ip)
  - improved on configuration (use common config.js file), renamed some configs
  - added CORS configurations
  - added proxy middleware (can use this to serve web site from another server instead of serving from express static folder, note CORS needs to be configured properly)
- frontend and backend
  - improve on JWT, two ways to do expiry extension and revocation
    - correctly implement expiry refresh token
    - httponly session cookies, add proxy middleware to test (app and www must be seen to be from same IP/Domain and Port)
    - Removed nuxt/auth as refresh token support and httponly cookies is not there
  - take care of cors / same-origin
  - refactored **example-ssr** focus on reducing technical debt, removed nuxt-auth and axios modules, due to limitations, reuse frontend auth code from example-spa

### Version 0.2.4
- update packages
- VueCrudX
  - improve layout of table and forms, add to VueCrudX.md documentation
  - fixed issue with load more for infinite scroll (simplified process also)

### Version 0.2.3
- update packages
- VueCrudX
  - add vcx to onRowClick (so you can reference things in VueCrudX)
  - additional error check ```if (status === 200 && data)``` after this.crud.findOne call
  - add render function in Form Fields configuration to allow record field to be transformed to format used the input
- example-spa
  - fix major error when using firebase or mongo stitch
  - improve on configs, recaptcha moved to env file
  - fix firebase implemention, should use firebase/app, not @firebase/app

### Version 0.2.2
- update packages
- add pm2 logging folders
- VueCrudX.vue
  - bug fix _isHidden & _isReadOnly, use... ```&& !!this.selectedId``` instead of ```&& this.selectedId```
  - make export workable
  - minor fixes on UI, remove unnecessary horizontal scroll in form and filters when displaying more than 1 field in a row, padding adjustments
  - fix input parameters of crud updated() & created() overridable functions. change from **record** object (parameters passed into crud create() or update()) to **data** object (parameters returned from crud create() or update()). NOTE **created** AND **create**, **updated** and **update**...
  - minor fix change this.deleteRecord(...) to deleteRecord(...) in template
- improve date & time picker components
- example-spa/src/assets/util.js
  - exportCsv function change from hardcoded output filename to user definable (also to deprecate for improved function)
  - replace exportCsv, exportJson with downloadData (new function, works with IE and can handle larger filesize downloads in chrome)
  - replace makeCsvRow with more robust function from json2csv library

### Version 0.2.1
- update to Vuetify 2.0.1, & other packages
- fix form layouts
- make db init os agnostic

### Version 0.2.0
- update to Vuetify 2.0 (many breaking changes)
- vue-crud-x Version 0.1.x using Vuetify 1 to be supported in vue-crud-x [v1 branch](https://github.com/ais-one/vue-crud-x/tree/v1)
- redesign, improve and refactor **redesigned to make it easier to implement on other UI frameworks**
- consolidate examples, nuxt-example to focus mainly on nuxt issues only
- add JSDoc & OpenAPI support
- add SAML ADFS authentication example in backend example
- package updates
