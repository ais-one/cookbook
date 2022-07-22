### Version 0.6.11
- [chore] update packages & cleanup & work on improving documentation
- [js-node/expressjs] Breaking Change on configs
  - use .env file for configs, move configs from `global` to `process.env`
  - move .env files into apps/[app-template] folder
  - Mongo DB config format change, change ObjectID to ObjectId
  - JWT_CERTS, JWT_REFRESH_CERTS, HTTPS_CERTS format change
  - MONGO_OPTIONS, UPLOAD_STATIC change in format and processing
  - fixed jest tests
- [js-web/vue-vite]
  - remove cypress and use playwright (also renamed document from cypress.md to e2e.md)
  - add useMediaQuery hook
- [@es-labs/node] Breaking Change on configs
  - remove bullmq
- [js-web/react-admin] Moved to new repo [https://github.com/ais-one/cookbook-ts](https://github.com/ais-one/cookbook-ts)
- [js-node/nest-admin] Moved to new repo [https://github.com/ais-one/cookbook-ts](https://github.com/ais-one/cookbook-ts)

### Version 0.6.10
- [chore] update packages & cleanup & work on improving documentation

### Version 0.6.9
- [chore] update packages & cleanup & work on improving documentation
- [js-web/react-admin] update to react-router-dom v6
- [js-node/nest-microservice] removed, refer to the github projects instead in [README.md](README.md)
- [chore] updated list of useful VS Code plugins [README.md](README.md)

### Version 0.6.8
- [chore] update packages & cleanup & work on improving documentation
- [js-web/vue-vite] integrate [https://github.com/ais-one/favv/vitevue](https://github.com/ais-one/favv/vitevue) to [js-web/vue-vite](js-web/vue-vite)
- [js-web/vue-vite] update firebase messaging from 8 to 9, fix PN bugs and improve PN test on UI
- [js-node/expressjs] update firebase messaging from 8 to 9, fix PN bugs
- [chore] add sri and crossorigin to scripts - https://github.com/bigskysoftware/htmx/issues/261#issuecomment-753850081
- [js-node/expressjs] fix eslint 8.0.0 errors (remove babel-eslint package)
- [js-node/expressjs] update documentation on VS Code plugins REST Client and MongoDB for VS Code
- [js-node/expressjs] added playground file for MongoDB for VS Code
- [js-node/wip] removed `fido2` project (very outdated), up-to-date example is in `js-node/expressjs` project
- [react-nestjs] moved projects into `js-node` or `js-web` folders as appropriate
- [js-web/lucia] removed can use petite-vue instead
- [chore] migration to node 16 and npm 8, update docs

### Version 0.6.7
- [chore] update packages & cleanup & work on improving documentation
- [js-web/vue-vite] make cypress work with cicd, start-server-and-test
- [backend-saml] test node-saml library without passport, implement test route /api/saml/test, you can see how to generate auth url and parse response in the code
- [backend-saml] remediate - https://github.com/node-saml/node-saml/issues/21
- [js-node/expressjs] streaming file download, create pdf, download pdf
- [react-nestjs]
  - [react-nestjs/react-admin] React + TS example from https://www.udemy.com/course/react-nest-admin/, to keep updating and further develop
  - [react-nestjs/nest-admin] NestJS example from https://www.udemy.com/course/react-nest-admin/, to keep updating and further develop
- [feat] removed husky, use git-hooks directly instead

### Version 0.6.6
- [chore] update packages & cleanup & work on improving documentation
- [js-node/expressjs] minor breaking change. auth callback delimiter from '-' to ';' because '-' can be found in jwt token (https://stackoverflow.com/questions/55201011/what-characters-are-allowed-in-a-jwt-token) and delimiting using '-' can be wrong, use ';' as it can be used in url hash (https://stackoverflow.com/questions/40636281/what-are-the-eligible-characters-in-a-urls-fragment-location-hash) and is not in jwt token
- [js-node/wip/k8s] moved to [docs]
- [js-web/vue-vite] minor config change VITE_SAML_URL and VITE_CALLBACK_URL to use full URL paths, simplify saml call, **@es-labs/esm/saml.js** REMOVED
- [js-web/vue-vite] improve structure for deployment of multiple apps
- [chore] add fido2 spa sample in [js-node/expressjs], clean up ssr example from [js-node/wip/fido2]
- [js-web/vue-vite] fix login & logout add loading spinner
- [js-web/vue-vite] cypress e2e testing

### Version 0.6.5
- [chore] update packages & cleanup & work on improving documentation
- [js-web/vue-vite] make it configurable
- [js-web/vue-vite] improve logged-in layout and scrollbar when overflow
- [js-node/scaled-ws] scale websockets
- [js-node/expressjs] moved jobs and uploads folder to template application, add JOB_PATH config for jobs, so path to jobs can be specified
- [chore] clean up code based on sonarcloud issues

### Version 0.6.4
- [chore] update packages & cleanup & work on improving documentation
- [@es-labs/node](@es-labs/node) allow options to be passed in also, currently uses global.CONFIG through (**@es-labs/node/config**)
- [@es-labs/node/services/websocket.js](@es-labs/node/services/websocket.js) add onClientConnect function
- breaking changes
  - [@es-labs/node/auth](@es-labs/node/auth) - convert to class
  - [@es-labs/node/services/redis.js](@es-labs/node/services/redis.js) - move to [@es-labs/node/services/db/redis.js](@es-labs/node/services/db/redis.js)
  - [@es-labs/node/services/keyv.js](@es-labs/node/services/keyv.js) - move to [@es-labs/node/services/db/keyv.js](@es-labs/node/services/db/keyv.js)
  - [@es-labs/node/services/db](@es-labs/node/services/db) - convert to class, allow multiple connections
  - [@es-labs/node/services/webpush.js](@es-labs/node/services/webpush.js) - add setup function, move to [@es-labs/node/services/comms/webpush.js](@es-labs/node/services/comms/webpush.js)
  - [@es-labs/node/comms](@es-labs/node/comms) - add setup function
  - [@es-labs/node/services/gcp.js](@es-labs/node/services/gcp.js) add setupStorage function
  - [js-node/expressjs/apps/app-template/config/secret/README.md](js-node/expressjs/apps/app-template/config/secret/README.md) - improve oauth configuration
  - [js-node/expressjs/router/saml.js](js-node/expressjs/router/saml.js) - improve saml configuration, only have RelayState in query
  - [js-node/expressjs/router/saml.js](js-node/expressjs/router/t4t.js) - allow multiple connections, see also the [table configs](js-node/expressjs/apps/app-template/tables)

### Version 0.6.3
- [chore] update packages & cleanup & work on improving documentation
- [chore] improve github workflow and documentation
- [js-web/vue-vite] add sentry when ready
- [fix] typeof xx === 'object' - handle if xx is null
- [js-node/expressjs] make deployment application specific also, moved **deploy** folder to [js-node/expressjs/apps/app-template](js-node/expressjs/apps/app-template), migration and seeding, and GCP deployment config adjusted to address the folder location change

### Version 0.6.2
- [chore] rename project

### Version 0.6.1
- [chore] update packages & cleanup & work on improving documentation
- [note] Folder renames - No breaking change except folder renames in docs and configs
  - **vue-nobundler** to js-web/vue-nobundler
  - **vue-vite** to js-web/vue-vite
  - **node-utils** to node-daemons and remove **node-utils**
  - **node-daemons** to js-node
  - **node-express** to js-node/expressjs
  - **wip** to js-node/wip
- [js-node/expressjs] add graphql sample code for simple CRUD (with graphiql queries & variables provided) [sample](js-node/expressjs/public/demo-express/graphql.html)
- [js-node/expressjs] improve shutdown / cleanup [sample](js-node/expressjs/app.js)
- [js-web/vue-vite] add multi-page app example
- [js-node/expressjs] add sentry [file](js-node/expressjs/common/sentry.js)
- [js-node/expressjs/public/demo-express] add sentry [sample](js-node/expressjs/public/demo-express/index.html)
- [chore] disable console.log at frontend [@es-labs/esm/log-filter.js](@es-labs/esm/log-filter.js) and [sample](js-node/expressjs/public/demo-express/index.html)

### Version 0.6.0
- [chore] update packages & cleanup & work on improving documentation
- [note] rename example-native to vue-nobundler - No breaking change
- [note] rename example-vite to vue-vite - No breaking change
- [note] rename example-app to node-express - Breaking change (major folder reorganization) 
- [node-express] create apps/app-template (reference application, we can create more apps inside the apps folder, the custom apps can be in another repo) 
- [node-express] move config to apps/app-template/config
- [node-express] move @es-labs/node/express back to node-express/common
  - [node-express] add server side event (SSE) example
  - [node-express] add serve-index function to uploads folder (list files and folders)
  - [node-express] multiple UPLOAD_STATIC & UPLOAD_MEMORY
  - [@es-labs/node] for config, do not restrict environments to development, uat, production, let user define 
- [chore] remove example-webpack, document last known good version in README.md
- [node-daemons/tcpserver] stream-based TCP server
- [node-daemons/tcpserver] event-based TCP server
- [@es-labs/node] remove objection ORM
- [chore] prepare package.json for workspaces, added workspaces entry
- [node-daemons] nodejs workers
- [node-express] shared webworkers
- [node-express] openapi implementation and validation middleware
- [node-utils] create openapi file joiner, better for now to create single file for use by swagger-ui-express and express-openapi-validator
- [node-express] replace bloated and flaky apollo with express-graphql and graphql-ws, need to close nicely

### Version 0.5.3
- [chore] update packages & cleanup & work on improving documentation
- [example-app] add oidc example (grant_type: authorization_code), improve further on auth structure, rename GITHUB_ to OAUTH_
- [feat] added husky

### Version 0.5.2
- [chore] update packages & cleanup & work on improving documentation
- [chore] upload **@es-labs/esm** and **@es-labs/node** as scoped public packages on npm
- [chore] add **keycloak** to **docker-devenv**, removed **saml** (kristophjunge/test-saml-idp)
- [@es-labs/node] passport-saml version 3 onward, cert needs to have value! use keycloak
- [wip/fido2] demo for web auth login (for SPA and SSR pages) (https://developers.google.com/codelabs/webauthn-reauth) - need to update webauthnsimple to v3

### Version 0.5.1
- [chore] update packages & cleanup & work on improving documentation
- [example-app] implement configs for helmetjs
- [example-app] web worker example file upload - https://kongaraju.blogspot.com/2012/07/large-file-upload-more-than-1gb-using.html
- [example-app] moved common-express folder files to @es-labs\node\express
- [fix] @es-labs/esm/bwc-table.js - fixed filter (so that adding or removing each filter does not remove input values), and page change bugs
- [doc] add note on commit messages
- [example-native] migrate example-webpack vue-crud-x table examples to example-native
  - clean up repeated table code [Done]
  - handle junction tables (many to many) [Done]
  - delete - delete data with related keys in other tables - use soft delete or foreign key [Done]
  - search filter for references
    - m/n (not possible, unless id value is same as label, or filter input is multi-select auto-complete) - https://dba.stackexchange.com/a/239069 [Note]
    - for multiple tags (1/m), the value and label must be same, column must use token seperated string, or filter input is multi-select auto-complete [Note]
    - for single tags (1/1) - need to search join column, or filter input is single-select auto-complete [Done]

### Version 0.5.0
- [chore] update packages & cleanup & work on improving documentation
- [update] clean up auth codes..., breaking change on return values of /api/auth/login and /api/auth/otp, SAML configuration, additional AUTH_ and JWT_ configurations, @es-labs/esm/http.js, @es-labs/node/auth/index.js, example-app auth controller and auth route
- [frontend] able to create and use multiple
  - http requests (also stop using @es-labs/esm/http.js, change to @es-labs/esm/fetch.js)
  - ws
  - i18n (do not need to make multiple, keep as single)
- [example-native] migrate example-webpack vue-crud-x table examples to example-native
  - category, author, book - has 1 category & has book_author, page - belongs to 1 book
  - child table
  - handle one-to-one/one-to-many relation
  - back button at child table
  - handle junction tables (many to many) [TODO]
    - read [Done], create [Done] - do not allow in create operation, update [Done]
    - delete - how to delete data in related keys in other tables [TODO]
  - search filter [TODO]
    - m/n, 1/1 or 1/m

### Version 0.4.8
- [chore] update packages & cleanup & work on improving documentation
- [example-vite] add rxjs example in demo (debounce, switchMap, etc)
- [example-native] urgent fix resolve CORS issue which stops js from loading

### Version 0.4.7
- [chore] update packages & cleanup & work on improving documentation
- [@es-labs/esm/bwc-combobox.js] - new component: multi-select tags, autocomplete, optional to create new, use string or object, clear text button
- [@es-labs/esm/bwc-combobox.js] - use onselect instead of onselected (does not detect this event)
- [refactor] merge example-vite and example-vite-antd, remove unnecessary plugins, removed mwc
- [@es-labs/esm/bwc-t4t-form.js] - add autocomplete

### Version 0.4.6
- [chore] update packages & cleanup & work on improving documentation
- [update] remove circle-ci
- [update] rename common-lib to @es-labs, improve project structure
- [example-native] make create, update, delete, upload API work in example-native
- [update] create @es-labs folder for common nodejs and esm items
- [@es-labs/esm/bwc-autocomplete.js] add disabled attribute and input-class (for styling to bulma, bootstrap, muicss) attribute
- [@es-labs/esm/bwc-t4t-form.js] - handle select & textarea tag
- [example-amp] add sample AMP application
- [@es-labs/esm/bwc-table.js] - BREAKING CHANGE: use object instead or multiple variables for cell render(), see example-native/views/ui2.js for reference
- [@es-labs/esm/bwc-table.js] - BUG FIX: filter was not working
- [@es-labs/esm/bwc-fileupload.js] - created file input component
- [@es-labs/esm/bwc-t4t-form.js] - integrate to form... add file input functionlity on submit... (upload to server or signedUrl)
- [example-app] - improve multer & express preRoute, postRoute configs
- [example-vite] removed CrudTable.vue, use bwc-table in example-native, read env file in vite.config.js

### Version 0.4.5
- [chore] update packages & cleanup & work on improving documentation
- [github-actions] add github pages workflow, update manual workflow
- [example-nobundle] rename to example-native, /native
- [example-spa] rename to example-webpack (to be kept for legacy purpose)
- [example-vite] echarts v4 to v5 (ESM), mwc to 0.20.0
- [example-native] add google recaptcha
- [common-lib/esm/util.js] clarify debounce usage
- [example-vite] fix build path (dev / production), note need proper SSL cert for SW to work on non-localhost domain
- [example-app] controllers/auth.js/checkGithub - make callback URL configurable, improve github login, callback hash to include tokens instead of just token
- [example-native] moved github login here & improve on github config instructions
- [example-vite] update vite from v1 to v2
- [common-lib/esm/bwc-table.js] fix sort (was showing arrows on all columns), add new CSS variables for top value
- [example-app/router/tables/*.*] (generic crud) config changes
  - set our internal usage key to __key, to avoid collisions
  - hide = hide table
  - filter & sort is not enabled by default, need to set as true
- [common-lib/esm/bwc-t4t-form.js] - (generic crud) create form using web components - currently only input tag handled (TBD add select tag, and other custom tags, handle file inputs)
- [common-lib/esm/t4t-fe.js] - (generic crud) created utilities also includes validation...
- [common-lib/esm/t4t-validate.js] - (generic crud) created validation for backend use
- [example-vite] NOTE: mwc-multiselect.js is broken
- [example-vite] add initial i18n support

### Version 0.4.4
- [chore] update packages & cleanup & work on improving documentation
- [refactor] use common-lib for JS files used in the the frontend or backend 
- [refactor] move no bundler frontend app to own folder outside example-app (example-nobundle)
- [example-nobundle] from demo-nobundler, add bulma and improve visuals
- [example-vite] remove oruga (not ready for vue3+vite), implement saml callback and configs, make it work in production build
- [bulma-web-components] created bwc-autocomplete and bwc-table (based on bulma) in common-lib/esm
- [example-app] clean up backend, table csv upload
- [common-lib/esm] https.js handle application/json & multipart/form-data, handle allow empty json() from response

### Version 0.4.3
- [chore] update packages & cleanup & work on improving documentation
- [example-app] simple SAML test, fixed httponly cookie, mongo options
- [example-vite] rename folder pages to views, to follow ```<router-view>``` term, add oruga ui, fixed httponly cookie
- [docker-devenv] add mysql, hashicorp vault, saml IDP
- [chore] secrets management, reduce duplication deploy e.g. GCP_PROJECT_ID, seperate config (for services) and deploy (for deployments), hashicorp vault
- [backend-deployment] multi-stage docker build

### Version 0.4.2
- [chore] update packages & cleanup & work on improving documentation
- [chore] github actions, github dependabot
- [frontend] stripdown & migrate bundleless vue app in express to vue 3
- [backend] lint and husky for express

### Version 0.4.1
- [chore] update packages & cleanup & work on improving documentation
- [tested] Dockerfile, vite to GCP storage (script), backend to GCP Cloud Run (script), Test deploy backend to GCP VM (script), PM2
- [chore] eslint & prettier for vite
- [chore] pwa service worker & backend improvements, communication between sw and window (e.g. pushsubscriptionchange)
- [chore] move example-web/spa to example-spa, move example-web/vite to example-vite - For CI/CD purpose

### Version 0.4.0
- [chore] update packages & cleanup & work on improving documentation
- [table] validation
- [frontend]
  - example-web/vite
    - use webcomponent in a webcomponent - mwc-autocomplete, mwc-multiselect, mwc-fileupload
    - provide/inject use pattern for http calls (useXhr), i18n (useI18n)
    - add PWA, FCM(google cloud) and Webspush(self hosted) functionality, apollo-client (graphql), ws
    - fixed layout bug [https://dev.to/lampewebdev/vuejs-pages-with-dynamic-layouts-problems-and-a-solution-4460]
  - REMOVED example-web/pwa and example-web/ssr
- [full-stack]
  - fixed auth system
  - improve structure further (for microservices and CICD)
  - moved deploy scripts to respective individual project folders (example-app, example-web/vite)

### Version 0.3.5
- [chore] update packages & cleanup & work on improving documentation
  - add kafka [docs/kafka.md](docs/kafka.md) and tcp [docs/tcp.md](docs/tcp.md) working example
  - Handle/Test Signature & Webcam input see [docs/custom-element.md](docs/custom-element.md)

### Version 0.3.4
- [chore] update packages & cleanup & work on improving documentation
  - backend
    - bug fix on CRUD Table patch (remove MongoDB _id from body) 
  - frontend (common-lib/esm/http.js)
    - Fetch API abort / retry
  - doc
    - jsonschema validation for MongoDB collection

### Version 0.3.3
- [chore] update packages & cleanup & work on improving documentation
- improve npm scripts to handler Windows and Unix environments
- spa
  - removed vue-apollo wrapper to apollo client, just use apollo client directly, apollo client v2 to v3 has broken vue-apollo v3
- vite
  - web components or no bundler required UI framework, also make code more framework agnostic
  - generic table crud
  - add echarts and leaflet example
- backend
  - generic table crud

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
- example-app/public/demo-nobundle
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
- frontend /example-app/web folder hosts examples for SPA, static HTML
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
