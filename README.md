![master commit](https://badgen.net/github/last-commit/ais-one/vue-crud-x/master)
![release](https://img.shields.io/github/v/release/ais-one/vue-crud-x)
[![npm version](https://badge.fury.io/js/vue-crud-x.svg)](https://badge.fury.io/js/vue-crud-x)
[![npm](https://img.shields.io/npm/dm/vue-crud-x.svg)](https://www.npmjs.com/package/vue-crud-x)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=com.lapots.breed.judge:judge-rule-engine&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.lapots.breed.judge:judge-rule-engine)
[![Known Vulnerabilities](https://snyk.io/test/github/ais-one/vue-crud-x/badge.svg)](https://snyk.io/test/github/ais-one/vue-crud-x)
[![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/vue-crud-x/shield-link)

> **TL;DR** ExpressJS & VueJS Web App Cookbook, Customisable CRUD Library, CI/CD, Cloud Container Deployment, Web Components, ES Modules

Latest Version [0.4.7](https://github.com/ais-one/vue-crud-x/releases/tag/0.4.7) - Released 2021 Mar 05 0830 +8GMT

- Replaced mwc with Ant Design Vue in example-vite (https://github.com/material-components/material-components-web-components/issues/1940#issuecomment-724054652)
- Added bwc-combobox (an extension of bwc-autocomplete, supports multi-select and tags), and integrate it to bwc-t4t-form.js
- Improve documentation

# Features

- [SPA, ES Modules, Vue3 & Bulma](https://github.com/ais-one/vue-crud-x/tree/master/example-native): No bundler, scalable VueJS Application, example codes (signed uploads, JWT refresh token, OTP), recaptcha, Github OAuth2 login, **web component table, form & CRUD backend** (files to note)
  - example-app/router/tables/*.* - table configurations
  - example-app/router/t4t.js - handle backend CRUD API
  - @es-labs/esm/t4t-fe.js - frontend operations to interact with t4t.js
  - @es-labs/esm/t4t-validate.js - validation used by both front and backend
  - @es-labs/esm/bwc-table - used to display table
  - @es-labs/esm/bwc-t4t-form.js - form generated from table configurations
  - example-native/views/ui1.js - autcomplete, combobox, file upload example
  - example-native/views/ui2.js - table example
  - example-native/views/ui3.js - form example (with connection to backend)
  - example-native/views/ui4.js - table and form example (with connection to backend)
- [SPA, Vite, Vue3 & Ant Design Vue](https://github.com/ais-one/vue-crud-x/tree/master/example-vite): Web Components, Leaflet Map, ECharts, Webcam, Signature canvas, PWA, JWT refresh token, 2FA GA OTP, SAML, Websockets, Ant Design Vue, GraphQL
- [SPA, Vue-cli, Vue2 & Vuetify](https://github.com/ais-one/vue-crud-x/tree/master/example-webpack): Graphql (subscriptions, cache, optimistic UI, refetch queries), REST, VueCrudX, i18n, RxJS
- [Express JS Backend](https://github.com/ais-one/vue-crud-x/tree/master/example-app/)
  - Cors, proxy middleware, helmet, error handling, logging, OpenAPI
  - Objection ORM, Knex, MongoDb, Relational DB data example, migration, seed, GraphQL, Redis
  - Webpush & FCM push notification, Sendgrid email, Nexmo SMS, Telegram
  - AgendaJS message queue
  - File uploads, Signed URL file upload to GCP Storage
  - Websockets, graphql
  - JWT using RSA, JWT refresh token, token in HttpOnly cookies, GA OTP, role, Passport SAML
    - Github OAuth2 login (setup - https://www.sohamkamani.com/blog/javascript/2018-06-24-oauth-with-node-js)
  - Unit Test & Integration Test
- [Github Actions](https://github.com/ais-one/vue-crud-x/tree/master/.github/workflows) - Manual Trigger
- [Docker setups](https://github.com/ais-one/vue-crud-x/tree/master/docker-devenv) for Mongodb, Mysql, SAML IDP, Kafka, Hashicorp Vault
- [Secrets](https://github.com/ais-one/vue-crud-x/tree/master/docs/secrets.md)
- [Documentation](https://github.com/ais-one/vue-crud-x/tree/master/docs): always work in progress and to be improved
- [AMP Website](https://github.com/ais-one/vue-crud-x/tree/master/example-amp): AMP (Accelerated Mobile Page) application sample (TBD)


# QUICK START - ON YOUR LOCAL MACHINE

## Requirements

- NodeJS LTS
- For Windows, integrate bash shell to cmd shell (when installing git), or use git-bash
- Docker (easier to use VS Code Docker plugin)

## Download

```bash
# clone repo and install backend
git clone https://github.com/ais-one/vue-crud-x.git
cd vue-crud-x
```

## ExpressJS Backend Setup & Run - development environment

```bash
# install
cd example-app
npm i
npm i ../@es-labs/esm
npm i ../@es-labs/node
```

**NOTES**
- MongoDB examples needs MongoDB to work. To resolve, chose one of the methods to install MongoDB in **docs/mongodb/install.md**
- The **example-app/config/secret/*.env,js** files are not present. So there maybe some console log errors (but it is ok to ignore), graphql and websockets will not work. Quick start is still usable. Use the README.md to fill up

### Run migration & app

```bash
# create and seed relational db on SQLite, (delete the dev.sqlite file each time before you run this)
# command: npm run knex -- <development / uat / production> <seed / migrate>
npm run knex -- development migrate
npm run knex -- development seed

# create and seed MongoDB requires MongoDB - you can skip this but MongoDB examples will not work
# command: npm run mongo -- <development / uat / production> <seed / update>
npm run mongo -- development seed

# run the backend
# command: npm run app -- <development / uat / production>
npm run app -- development

# or npm run app:lint to include eslint checks

# Command to simulate long running process (do take note of caveats, for production need a monitor to handle restart strategy)
# command: npm run process-long -- development
npm run process-long

# Command to simulate process triggered by cron (**NOTE:** may be better to use cron to call API than trigger a process)
# command: npm run process-cron -- development
npm run process-cron
```

**Visit the following URLs**
- http://127.0.0.1:3000/api/healthcheck - app is running normally
- http://127.0.0.1:3000 - Website served by Express with functional samples and demos (click on link to view **native** app or link to view **vite production build** app)
- http://127.0.0.1:3000/api-docs - OpenAPI UI (Not Ready - In Progress)

### No bundler frontend

See **native** app above

### Testing

- To run unit & integration test on /api/authors. E2E testing is **Work In Progress**
- TO TEST EVERYTHING PLEASE change describe.only(...) to describe(...) in the test scripts in example-app/tests

```bash
# run in development only
npm run test
```

---

### Vite SPA Setup & Run - development environment

[Why Use Vite](https://indepth.dev/a-note-on-vite-a-very-fast-dev-build-tool/)

For Push Notification
- using Google FCM, setup your firebase account and messaging, also setup FCM server key in backend
- using self hosted webpush is also supported and available

```bash
cd example-vite
npm i
npm run dev
```

Navigate to http://127.0.0.1:8080/ to view application

Login using the following:
- User: test
- Password: test
- OTP (if enabled - e.g. USE_OTP=TEST): use 111111 as otp pin

You can test PWA Push notifications using Webpush or FCM () on Dashboard page depending on **.env.<environment>** file configuration (need to be on 127.0.0.1).

Click the following buttons in order (see their output in console.log and screen):
- sub PN (subscribe)
- Test PN (send a test message to user id 1 - on sqlite)
- Unsub PN (unsubscribe)

### Vite SPA - static build

```bash
cd example-vite
npm run dev:build # build into example app, development environment
npm run build-uat # build uat environment, deploy to GCP Storage
```
Navigate to http://127.0.0.1:3000/vite/

### Webpack SPA Setup & Run - development environment - TO DEPRECATE

```bash
cd example-webpack
npm i
npm run serve
```

Navigate to http://127.0.0.1:8080/webpack to view application with VueCrudX demo 

Login is same as Vite SPA

---

## Why No SSR or SSG

- potential slow rendering by server app, added complexity in code, rehydration errors, added complexity in server
- https://github.com/nuxt/nuxt.js/issues/8102
- prefer static sites and lazy loaded SPA for now

## SAML

Refer to link below on how to try out...
- https://github.com/ais-one/vue-crud-x/blob/develop/docker-devenv/saml/docker-compose.yml
- You can test out on the **example-vite** Signin UI, clicking on SAML button to see redirect callback
- https://github.com/ais-one/vue-crud-x/blob/develop/example-app/common-express/preRoute.js
- https://github.com/ais-one/vue-crud-x/blob/develop/example-app/router/saml.js

---
## Configuration

The **example-app/config/** folder contains the config information.

You can override the configurations using <NODE_ENV>.env.js files, e.g. development.env.js or uat.env.js in **example-app/config**

If too many config properties, split it to other more and files

---

## Project Strcuture

```
vue-crud-x
+- .github/ : github related CICD and automations
+- @es-labs/
|  +- esm/ : [shared es modules]
|     +- package.json
|  +- node/ : [shared cjs modules]
|     +- auth/ : authentication
|     +- comms/ : messaging
|     +- services/ : db
|     +- config.default.js: defaults
|     +- config.js: config loader
|     +- package.json
+- docker-devenv/ : docker for development environment
+- docs/ : documentation
+- example-amp/ : AMP example (TBD)
+- example-app/ : [example backend] - See example-app/README.md for Project Structure
|  +- common-express/ : common codes used in express apps
+- example-native/ : frontend (Vue3 no bundle) - See example-native/README.md for Project Structure
+- example-vite/ : frontend (Vue3 rollup) - See example-vite/README.md for Project Structure
|  +- lib/esm-rollup/ : rolled up components for frontend (e.g. apollo.js)
+- example-webpack/ : frontend associated to the backend (Vue2 webpack) - See example-webpack/README.md for Project Structure
|  +- lib/webpacked/ : webpacked components for frontend (e.g. VueCrudX.vue)
+- k8s/ : kubernetes YAML files (WIP)
+- .editorconfig
+- .gitignore
+- BACKLOG.md
+- CHANGELOG.md
+- LICENCE
+- package.json
+- README.md
+- rest-cmd.http : rest commands for testing
```

## CI/CD

Using github actions

Manually triggered deployment on .github/workflows/manual.yml

selectable inputs
- environment (uat for now, development does not deploy anything)
- application (example-app, example-vite)
- code branch

**NOTE** config/secret contents will not be in repo for CI/CD (so you can get errors), those should be put in VAULT

current secrets
- GCP_PROJECT_ID
- GCP_SA_KEY
- VAULT_uat, passed in as VAULT

```
# do not merge
VAULT="unused"

# connect to a hashicorp vault and obtain secrets to merge
VAULT={ url, token } # base64 encoded

 # pass in secrets, this way is insecure and not a good way to send in secrets
VAULT={ secrets: { ... all your secrets here } } # base64 encoded
```

## DOCUMENTATION

- Project roadmap at [BACKLOG.md](BACKLOG.md)
- Release notes at [CHANGELOG.md](CHANGELOG.md)
- Current Issues at [CHANGELOG.md](ISSUES.md)
- Main documentation starts at [docs/home.md](docs/home.md)
- **vue-crud-x** library documentation can be found in [docs/VueCrudX.md](docs/VueCrudX.md)
- Deployment notes can be found in (docs/deployment/home.md)
- Kafka [docs/kafka.md](docs/kafka.md) and code found in **example-app/sandbox**
- TCP Server [docs/tcp.md](docs/tcp.md) and code found in **example-app/sandbox**

## VERSION CHANGE NOTES

- **v0.4+** Improve folders and structure organization, handle CI/CD better
- **v0.3+** Reorganize folders and structure, for ease of developing and maintaining multiple applications.
- **v0.2+** uses Vuetify 2. Due to many breaking changes from Vuetify 1 to 2, CRUD component code was refactored to be more UI framework agnostic (reduce dependencies!), easier to use, improving code quality, documentation and <a href="https://dev.to/aisone/vuejs-expressjs-crud-cookbook-46l0" target="_blank">supprting article - VueJS+ExpressJS CRUD & Cookbook</a>
- **v0.1** and Vuetify 1 will be supported under the [v1 branch](https://github.com/ais-one/vue-crud-x/tree/v1). You can refer to the v1  <a href="https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054" target="_blank">Legacy Article (For Historical Reference)</a>
