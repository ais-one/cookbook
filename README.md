![master commit](https://badgen.net/github/last-commit/ais-one/vue-crud-x/master)
![release](https://img.shields.io/github/v/release/ais-one/vue-crud-x)
[![npm version](https://badge.fury.io/js/vue-crud-x.svg)](https://badge.fury.io/js/vue-crud-x)
[![npm](https://img.shields.io/npm/dm/vue-crud-x.svg)](https://www.npmjs.com/package/vue-crud-x)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=com.lapots.breed.judge:judge-rule-engine&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.lapots.breed.judge:judge-rule-engine)
[![Known Vulnerabilities](https://snyk.io/test/github/ais-one/vue-crud-x/badge.svg)](https://snyk.io/test/github/ais-one/vue-crud-x)
[![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/vue-crud-x/shield-link)

# About

**vue-crud-x** is a cookbook with evergreen recipes and templates to develop applications faster. While reducing the need for rewrite or refactoring due to changes in dependencies.

Considerations for this project are similar to [https://github.com/ais-one/favv/blob/master/README.md#considerations](https://github.com/ais-one/favv/blob/master/README.md#considerations).

The difference between this project and [https://github.com/ais-one/favv](https://github.com/ais-one/favv) are:
- vue-crud-x is more of a cookbook and recipes are constantly being improved and updated
- favv tries to seperate boiler plate from custom logic for better maintainability
- they complement each other and each can be used to improve on each other


We do not use Typescript because TS people can understand JS easily, but JS-only people need to pickup TS and its ecosystem. It is easier for TS people to take the JS here and implement with TS.

> **TL;DR** ExpressJS & VueJS Web App Cookbook, Customisable CRUD Library, CI/CD, Cloud Container Deployment, Web Components, ES Modules

Latest Version [0.5.3](https://github.com/ais-one/vue-crud-x/releases/tag/0.5.3) - Released 2021 July 02 0730 +8GMT

- add oidc example and improved auth handling
- [NOTE!] project name is going to be replaced to a more appropriate one

# Features

Folder | Description | Features
---|---|---
[@es-labs/esm](@es-labs/esm) | resuable ES module codes | Available as npm package also
[@es-labs/node](@es-labs/node) | reusable common JS codes | Available as npm package also
[docker-devenv](docker-devenv) | Docker containers supporting local development | Mongodb, Mysql, Keycloak(SAML/OIDC, etc IDP), Kafka, Hashicorp Vault, Redis
[docs](docs) | Documentation | always work in progress and to be improved<br>- Main [documentation](docs/home.md)<br>- Secrets [documentation](docs/secrets.md)<br>- vue-crud-x [documentation](docs/VueCrudX.md)<br>- Deployment [notes](docs/deployment/home.md)<br>- Kafka [docs](docs/kafka.md) and [code](example-app/sandbox)<br>- TCP Server [docs](docs/tcp.md) and [code](example-app/sandbox)
[example-app](example-app) | Backend applications (REST API, TCP server, etc) | - CORS, proxy middleware, helmet, error handling, logging, OpenAPI<br>- Objection ORM, Knex, MongoDb, Relational DB data example, migration, seed, GraphQL, Redis<br>- Webpush & FCM push notification, Sendgrid email, Nexmo SMS, Telegram<br>- AgendaJS message queue<br>- Unit Test & Integration Test
[example-app/public/demo-express](example-app/public/demo-express) | Frontend to test backend features | - File uploads, Signed URL file upload to GCP Storage, websockets, webworkers (frontend demo)<br>- JWT using RSA, JWT refresh token, token in HttpOnly cookies, GA OTP, role, Passport SAML, OIDC<br>- Github OAuth2 login (setup - https://www.sohamkamani.com/blog/javascript/2018-06-24-oauth-with-node-js)
[example-native](example-native) | Vue 3 SPA no bundler + Bulma | - signed uploads<br>- JWT refresh token, OTP, recaptcha, Github OAuth2<br>- **Web component table, form & CRUD backend** (files to note)<br><table><tr><td>[example-app/router/tables/](example-app/router/tables/)</td><td>table configurations</td></tr><tr><td>[example-app/router/t4t.js](example-app/router/t4t.js)</td><td>handle backend CRUD API</td></tr><tr><td>[@es-labs/esm/t4t-fe.js](@es-labs/esm/t4t-fe.js)</td><td>frontend operations to interact with t4t.js</td></tr><tr><td>[@es-labs/esm/t4t-validate.js](@es-labs/esm/t4t-validate.js)</td><td>validation used by both front and backend</td></tr><tr><td>[@es-labs/esm/bwc-table](@es-labs/esm/bwc-table)</td><td>used to display table</td></tr><tr><td>[@es-labs/esm/bwc-t4t-form.js](@es-labs/esm/bwc-t4t-form.js)</td><td>form generated from table configurations</td></tr><tr><td>[example-native/views/ui1.js](example-native/views/ui1.js)</td><td>autcomplete, combobox, file upload example</td></tr><tr><td>[example-native/views/ui2.js](example-native/views/ui2.js)</td><td>table example</td></tr><tr><td>[example-native/views/ui3.js](example-native/views/ui3.js)</td><td>form example (with connection to backend)</td></tr><tr><td>[example-native/views/ui4.js](example-native/views/ui4.js)</td><td>table and form example (with connection to backend)</td></tr></table>
[example-vite](example-vite) | Vue 3 SPA using vite + Ant Design | - Leaflet Map, ECharts<br>- PWA<br>- JWT refresh token, 2FA GA OTP, OIDC, SAML<br>- Websockets<br>- GraphQL<br>- rxJS<br>- Web Components (Webcam, Signature)
[example-webpack](example-webpack) - Deprecated | Vue 2 SPA using webpack + Vuetify | - Graphql (subscriptions, cache, optimistic UI, refetch queries)<br>- REST<br>- VueCrudX<br>- i18n<br>- rxJS
[wip](wip) | Work In Progress | - [Webauthn](wip/fido2) SPA & SSR sample implementation<br>- [K8s](wip/k8s)
[.github/workflows](.github/workflows) | Github Actions | Manually Triggered CI/CD

- AMP Website: [removed](https://plausible.io/blog/google-amp)

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

You can test PWA Push notifications using Webpush or FCM on Dashboard page depending on **.env.<environment>** file configuration (need to be on 127.0.0.1).

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

### Webpack SPA Setup & Run - development environment - DEPRECATED

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

## SAML & OIDC

Refer to link below on how to try out...
- [Keycloak](docker-devenv/keycloak/README.md) README.md
- You can test out on the [example-vite](example-vite) Signin UI, clicking on SAML button / OIDC button to see redirect callback
- Refer also to the following files
  - [@es-labs/node/express/passport.js](@es-labs/node/express/passport.js)
  - [example-app/router/saml.js](example-app/router/saml.js)
  - [example-app/router/oidc.js](example-app/router/oidc.js)

---

## Configuration

The [example-app/config](example-app/config) folder contains the config information.

You can override the configurations using <NODE_ENV>.env.js files, e.g. development.env.js or uat.env.js in [example-app/config](example-app/config)

---

## Project Strcuture

```
+- .github/ : github related CICD and automations
+- @es-labs/
|  +- esm/ : [shared es modules]
|     +- package.json
|  +- node/ : [shared cjs modules]
|     +- auth/ : authentication
|     +- comms/ : messaging
|     +- services/ : db
|     +- express/ : common codes used in express JS apps
|     +- config.default.js: defaults
|     +- config.js: config loader
|     +- package.json
+- docker-devenv/ : docker for development environment
+- docs/ : documentation
+- example-app/ : [example backend] - See example-app/README.md for Project Structure
+- example-native/ : frontend (Vue3 no bundle) - See example-native/README.md for Project Structure
+- example-vite/ : frontend (Vue3 rollup) - See example-vite/README.md for Project Structure
+- example-webpack/ : frontend associated to the backend (Vue2 webpack) - See example-webpack/README.md for Project Structure
|  +- lib/webpacked/ : webpacked components for frontend (e.g. VueCrudX.vue)
+- wip/ : projects in progress
|  +- k8s/ : kubernetes YAML files (WIP)
|  +- fido2/ : WebAuthn example
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

## VERSION CHANGE NOTES

- **v0.5+** Improve organization and authentication, add new features
- **v0.4+** Improve folders and structure organization, handle CI/CD better
- **v0.3+** Reorganize folders and structure, for ease of developing and maintaining multiple applications.
- **v0.2+** uses Vuetify 2. Due to breaking changes from Vuetify 1 to 2, CRUD component code was refactored to be more UI framework agnostic (reduce dependencies!), easier to use, improving code quality, documentation and <a href="https://dev.to/aisone/vuejs-expressjs-crud-cookbook-46l0" target="_blank">supprting article - VueJS+ExpressJS CRUD & Cookbook</a>
- **v0.1** and Vuetify 1 will be supported under the [v1 branch](https://github.com/ais-one/vue-crud-x/tree/v1). You can refer to the v1  <a href="https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054" target="_blank">Legacy Article (For Historical Reference)</a>
