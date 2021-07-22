![master commit](https://badgen.net/github/last-commit/ais-one/vue-crud-x/master)
![release](https://img.shields.io/github/v/release/ais-one/vue-crud-x)
[![npm version](https://badge.fury.io/js/vue-crud-x.svg)](https://badge.fury.io/js/vue-crud-x)
[![npm](https://img.shields.io/npm/dm/vue-crud-x.svg)](https://www.npmjs.com/package/vue-crud-x)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=com.lapots.breed.judge:judge-rule-engine&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.lapots.breed.judge:judge-rule-engine)
[![Known Vulnerabilities](https://snyk.io/test/github/ais-one/vue-crud-x/badge.svg)](https://snyk.io/test/github/ais-one/vue-crud-x)
[![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/vue-crud-x/shield-link)

# About

> **TL;DR** ExpressJS, VueJS cookbook, with evergreen recipes and templates (CRUD, CI/CD, Cloud container deployment, Web Components, ES Modules) to develop applications faster, while reducing the need for rewrite or refactoring due to changes in dependencies.

**NOTE!** project name is going to be replaced to a more appropriate one in 0.6.2

Latest Version [0.6.1](https://github.com/ais-one/vue-crud-x/releases/tag/0.6.1) - Released 2021 July 23 1500 +8GMT

Considerations for this project are similar to [https://github.com/ais-one/favv](https://github.com/ais-one/favv/blob/master/README.md#considerations). The difference between this project and [https://github.com/ais-one/favv](https://github.com/ais-one/favv) are:
- vue-crud-x is more of a cookbook and recipes are constantly being improved and updated
- favv tries to seperate boiler plate from custom logic for better maintainability
- they complement each other and each can be used to improve on each other

We do not use Typescript because TS people can understand JS easily, but JS-only people need to pickup TS and its ecosystem. It is easier for TS people to take the JS here and implement with TS.

# Features

Folder | Description | Features
---|---|---
[@es-labs/esm](@es-labs/esm) | resuable ES module codes | Available as npm package also
[@es-labs/node](@es-labs/node) | reusable common JS codes | Available as npm package also
[docker-devenv](docker-devenv) | Docker containers<br>supporting local development | Mongodb, Mysql, Keycloak(SAML/OIDC, etc IDP), Kafka, Hashicorp Vault, Redis
[docs](docs) | Documentation<br>To constantly improved/updated | - Main [documentation](docs/home.md)<br>- Secrets [documentation](docs/deployment/secrets.md)<br>- Deployment [notes](docs/deployment/home.md)<br>- Kafka [docs](docs/backend/kafka.md) and [code](js-node)<br>- TCP Server [docs](docs/backend/tcp.md) and [code](js-node)
[js-node](js-node) | Backend applications<br>(TCP server, Kafka consumer, etc) | - TCP server (event/stream)<br>- Serial server<br>- Kafka consumer/producer<br>- cron / long-running process example<br>- Combine OpenAPI files for use (openapi-file-joiner)
[js-node/expressjs](js-node/expressjs) | Backend applications<br>(REST API, Websocket, etc) | - CORS, proxy middleware, helmet, error handling, logging, OpenAPI<br>- Objection ORM (**removed**), Knex, MongoDb, Relational DB data example, migration, seed, GraphQL, Redis<br>- Webpush & FCM push notification, Sendgrid email, Nexmo SMS, Telegram<br>- AgendaJS message queue<br>- Unit Test & Integration Test
[js-node/expressjs/public/demo-express](js-node/expressjs/public/demo-express) | Frontend to test backend features | - GraphQL, File uploads, Signed URL file upload to GCP Storage, websockets, SSE, webworkers (frontend demo)<br>- JWT using RSA, JWT refresh token, token in HttpOnly cookies, GA OTP, role, Passport SAML, OIDC<br>- Github OAuth2 login (setup - https://www.sohamkamani.com/blog/javascript/2018-06-24-oauth-with-node-js)
[js-node/wip](js-node/wip) | Work In Progress | - [Webauthn](js-node/wip/fido2) SPA & SSR sample implementation<br>- [K8s](js-node/wip/k8s)
[js-web/vue-nobundler](js-web/vue-nobundler) | Vue 3 SPA no bundler + Bulma | - signed uploads, recaptcha<br>- **Web component table, form & CRUD backend** (files to note)<br><table><tr><td>[js-node/expressjs/router/tables/](js-node/expressjs/router/tables/)</td><td>table configurations</td></tr><tr><td>[js-node/expressjs/router/t4t.js](js-node/expressjs/router/t4t.js)</td><td>handle backend CRUD API</td></tr><tr><td>[@es-labs/esm/t4t-fe.js](@es-labs/esm/t4t-fe.js)</td><td>frontend operations to interact with t4t.js</td></tr><tr><td>[@es-labs/esm/t4t-validate.js](@es-labs/esm/t4t-validate.js)</td><td>validation used by both front and backend</td></tr><tr><td>[@es-labs/esm/bwc-table](@es-labs/esm/bwc-table)</td><td>used to display table</td></tr><tr><td>[@es-labs/esm/bwc-t4t-form.js](@es-labs/esm/bwc-t4t-form.js)</td><td>form generated from table configurations</td></tr><tr><td>[js-web/vue-nobundler/views/ui1.js](js-web/vue-nobundler/views/ui1.js)</td><td>autcomplete, combobox, file upload example</td></tr><tr><td>[js-web/vue-nobundler/views/ui2.js](js-web/vue-nobundler/views/ui2.js)</td><td>table example</td></tr><tr><td>[js-web/vue-nobundler/views/ui3.js](js-web/vue-nobundler/views/ui3.js)</td><td>form example (with connection to backend)</td></tr><tr><td>[js-web/vue-nobundler/views/ui4.js](js-web/vue-nobundler/views/ui4.js)</td><td>table and form example (with connection to backend)</td></tr></table>
[js-web/vue-vite](js-web/vue-vite) | Vue 3 SPA using vite + Ant Design | - Leaflet Map, ECharts<br>- PWA<br>- JWT refresh token, 2FA GA OTP, OIDC, SAML, Github OAuth<br>- Websockets, rxJS<br>- Web Components (Webcam, Signature)
example-webpack<br><b>(Deprecated & removed)</b><br>[last updated version](https://github.com/ais-one/vue-crud-x/tree/0.5.3) | Vue 2 SPA using webpack + Vuetify | - Graphql, REST, VueCrudX, i18n, rxJS
[.github/workflows](.github/workflows) | Github Actions (CI/CD) | - Manually Trigger<br>- On-push Trigger (WIP)
AMP Website | [removed](https://plausible.io/blog/google-amp) | -

# QUICK START - ON YOUR LOCAL MACHINE

## Requirements

- NodeJS LTS
- For Windows, **integrate bash shell to cmd shell** (when installing git), or use git-bash
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
cd js-node/expressjs
npm i
npm i ../@es-labs/esm
npm i ../@es-labs/node
```

**NOTES**
- MongoDB examples needs MongoDB to work. To resolve, chose one of the methods to install MongoDB in **docs/backend/mongodb/install.md**
- The **js-node/expressjs/apps/app-template/config/secret/*.env,js** files are not present. So there maybe some console log errors (but it is ok to ignore) and websockets will not work. Quick start is still usable. Use the README.md to fill up

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
```

**Visit the following URLs**
- http://127.0.0.1:3000/api/healthcheck - app is running normally
- http://127.0.0.1:3000 - Website served by Express with functional samples and demos
- http://127.0.0.1:3000/api-docs - OpenAPI documentation

Note: to generate api docs, visit [js-node/openapi-file-joiner](js-node/openapi-file-joiner) and follow readme file, also look at the config properties OPENAPI_PATH and OPENAPI_VALIDATOR in [js-node/expressjs/apps/app-template/config/common.env.js](js-node/expressjs/apps/app-template/config/common.env.js).

### No bundler frontend

See **native** app above

### Testing

- To run unit & integration test on /api/authors. E2E testing is **Work In Progress**
- TO TEST EVERYTHING PLEASE change describe.only(...) to describe(...) in the test scripts in js-node/expressjs/apps/app-template/tests

```bash
# run in development only
npm run test
```

### Long Running Processes

Codes for long running processes
- tcp server (event mode, streaming mode)
- serial server
- kafka producer, consumer
- cron-triggered process

```
cd js-node

# Command to simulate long running process (do take note of caveats, for production need a monitor to handle restart strategy)
# command: npm run process-long -- development
npm run process-long

# Command to simulate process triggered by cron (**NOTE:** may be better to use cron to call API than trigger a process)
# command: npm run process-cron -- development
npm run process-cron
```

---

### Vite SPA Setup & Run - development environment

[Why Use Vite](https://indepth.dev/a-note-on-vite-a-very-fast-dev-build-tool/)

For Push Notification
- using Google FCM, setup your firebase account and messaging, also setup FCM server key in backend
- using self hosted webpush is also supported and available

```bash
cd js-web/vue-vite
npm i
npm run dev
```

Navigate to:
- http://127.0.0.1:8080/ to view application
- http://127.0.0.1:8080/nested/index.html to view another page (vite serving multi page, each page can be an SPA)

#### http://127.0.0.1:8080/ Application

Login using the following:
- User: test
- Password: test
- OTP (if enabled - e.g. USE_OTP=TEST): use 111111 as otp pin

You can test PWA Push notifications using Webpush or FCM on Dashboard page depending on **.env.<environment>** file configuration (need to be on 127.0.0.1).

Click the following buttons in order (see their output in console.log and screen):
- sub PN (subscribe)
- Test PN (send a test message to user id 1 - on sqlite)
- Unsub PN (unsubscribe)

### Vite SPA - static build

```bash
cd js-web/vue-vite
npx vite build --mode development # build into example app, development environment
npx vite build --mode uat # build uat environment, deploy to GCP Storage
```
Navigate to http://127.0.0.1:3000/vite/

## Why No SSR or SSG

- potential slow rendering by server app, added complexity in code, rehydration errors, added complexity in server
- https://github.com/nuxt/nuxt.js/issues/8102
- prefer static sites and lazy loaded SPA for now

## SAML & OIDC

Refer to link below on how to try out...
- [Keycloak](docker-devenv/keycloak/README.md) README.md
- You can test out on the [js-web/vue-vite](js-web/vue-vite) Signin UI, clicking on SAML button / OIDC button to see redirect callback
- Refer also to the following files
  - [js-node/expressjs/router/saml.js](js-node/expressjs/router/saml.js)
  - [js-node/expressjs/router/oidc.js](js-node/expressjs/router/oidc.js)

---

## Configuration

The [js-node/expressjs/apps/app-template/config](js-node/expressjs/apps/app-template/config) folder contains the config information.

You can override the configurations using <NODE_ENV>.env.js files, e.g. **development.env.js** or **uat.env.js** in the folder

---

## Project Strcuture

```
+- .github/ : github related CICD and automations
+- .husky : git hooks
+- @es-labs/
|  +- esm/ : [shared es modules]
|     +- package.json
|  +- node/ : [shared cjs modules]
|     +- auth/ : authentication
|     +- comms/ : messaging
|     +- services/ : db, mq, etc.
|     +- config.default.js: defaults
|     +- config.js: config loader
|     +- package.json
+- docker-devenv/ : docker for development environment
+- docs/ : documentation
+- js-node/ : nodejs applications (kafka, cron triggered, long running)
|  +- expressjs/ : express backend - See [js-node/expressjs/README.md](js-node/expressjs/README.md) for project structure
|  +- openapi-file-joiner/ : pre-process utility to combine openapi yaml files for use in openapi related packages
|  +- serialserver/
|  +- tcpserver/
|  +- wip/ : projects in progress
|  |  +- k8s/ : kubernetes YAML files (WIP)
|  |  +- fido2/ : WebAuthn example
|  +- worker-threads/ : demo on use of worker threads
+- js-web
|  +- vue-nobundler/ : frontend (Vue3 no bundle) - See [js-web/vue-nobundler/README.md](js-web/vue-nobundler/README.md) for Project Structure
|  +- vue-vite/: frontend (Vue3 rollup) - See [js-web/vue-vite/README.md](js-web/vue-nobundler/README.md) for Project Structure
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

Using github actions, deploy to GCP Cloud

Manually triggered deployment on .github/workflows/manual.yml

selectable inputs
- environment (uat for now, development does not deploy anything)
- application (js-node/expressjs, js-web/vue-vite)
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

## VERSION CHANGE NOTES

- **v0.6+** Improve organization, graceful exit, logging, project rename, add more nodejs applications
- **v0.5+** Improve organization and authentication, add new features
- **v0.4+** Improve folders and structure organization, handle CI/CD better
- **v0.3+** Reorganize folders and structure, for ease of developing and maintaining multiple applications.
- **v0.2+** uses Vuetify 2. Due to breaking changes from Vuetify 1 to 2, CRUD component code was refactored to be more UI framework agnostic (reduce dependencies!), easier to use, improving code quality, documentation and <a href="https://dev.to/aisone/vuejs-expressjs-crud-cookbook-46l0" target="_blank">supprting article - VueJS+ExpressJS CRUD & Cookbook</a>
- **v0.1** and Vuetify 1 will be supported under the [v1 branch](https://github.com/ais-one/vue-crud-x/tree/v1). You can refer to the v1  <a href="https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054" target="_blank">Legacy Article (For Historical Reference)</a>
