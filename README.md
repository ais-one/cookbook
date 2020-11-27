[![npm version](https://badge.fury.io/js/vue-crud-x.svg)](https://badge.fury.io/js/vue-crud-x) [![npm](https://img.shields.io/npm/dm/vue-crud-x.svg)](https://www.npmjs.com/package/vue-crud-x) [![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=com.lapots.breed.judge:judge-rule-engine&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.lapots.breed.judge:judge-rule-engine) [![Known Vulnerabilities](https://snyk.io/test/github/ais-one/vue-crud-x/badge.svg)](https://snyk.io/test/github/ais-one/vue-crud-x) [![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/vue-crud-x/shield-link)

> **TL;DR** ExpressJS & VueJS Web App Cookbook, Customisable CRUD Library, CI/CD, Cloud Container Deployment, Web Components, ES Modules, Vite

Latest Version [0.4.4](https://github.com/ais-one/vue-crud-x/releases/tag/0.4.4) - Released 2020 Nov 27 2200 +8GMT

# Features

- Frontend Examples
  - [Vite, Vue3 & mwc, vaadin](https://github.com/ais-one/vue-crud-x/tree/master/example-vite): Web Components, Leaflet Map, ECharts, Webcam, Signature canvas, PWA, [CRUD frontend](https://github.com/ais-one/vue-crud-x/tree/master/example-vite/components/CrudTable.vue) for [CRUD backend](https://github.com/ais-one/vue-crud-x/tree/master/example-app/router/t4t.js)
  - [SPA, Vue2 & Vuetify](https://github.com/ais-one/vue-crud-x/tree/master/example-spa): Websockets, Graphql (subscriptions, cache, optimistic UI, refetch queries), REST, VueCrudX, i18n, RxJS, 2FA login, Github social login, recaptcha, JWT refresh token, GA OTP
  - [Vanilla JS, ES Modules, Vue3 & bulma](https://github.com/ais-one/vue-crud-x/tree/master/example-nobundle): No bundler, scalable VueJS Application, example codes (signed uploads, JWT refresh token, OTP)
- [Express JS Backend](https://github.com/ais-one/vue-crud-x/tree/master/example-app/)
  - Cors, proxy middleware, helmet, error handling, logging, OpenAPI
  - Objection ORM, Knex, MongoDb, Relational DB data example, migration, seed, GraphQL, Redis
  - Webpush & FCM push notification, Sendgrid email, Nexmo SMS, Telegram
  - AgendaJS message queue
  - File uploads, Signed URL file upload to GCP Storage
  - Websockets, graphql
  - JWT using RSA, JWT refresh token, token in HttpOnly cookies, GA OTP, role, Passport SAML
  - Unit Test & Integration Test
- Development & Deployment
  - [Github Actions](https://github.com/ais-one/vue-crud-x/tree/master/.github/workflows) - Manual Trigger
  - [Docker setup](https://github.com/ais-one/vue-crud-x/tree/master/docker-devenv/mongodb) of mongodb with replica set, mysql, saml IDP, kafka
    - [MongoDB](https://github.com/ais-one/vue-crud-x/tree/master/docker-devenv/mongodb) of mongodb with replica set, mysql, saml IDP, kafka
    - [Mysql](https://github.com/ais-one/vue-crud-x/tree/master/docker-devenv/mysql)
    - [Saml IDP](https://github.com/ais-one/vue-crud-x/tree/master/docker-devenv/saml)
    - [hashicorp vault](https://github.com/ais-one/vue-crud-x/tree/master/docker-devenv/vault) & [secrets](https://github.com/ais-one/vue-crud-x/tree/master/docs/secrets.md)
  - [Documentation](https://github.com/ais-one/vue-crud-x/tree/master/docs): always work in progress and to be improved


# QUICK START - ON YOUR LOCAL MACHINE

Docker is required to test
- mongodb
- saml
- hashicorp vault
- kafka

## Backend, SPA, Vite, No Bundler

### Backend Setup & Run

```bash
# clone repo and install backend
git clone https://github.com/ais-one/vue-crud-x.git
cd vue-crud-x
npm run install

# install the required common-lib JS scripts
npm run update

# create and seed relational db on SQLite
npm run knex # windows
npm run knex:unix # linux or mac

# create and seed MongoDB requires MongoDB - you can skip this but MongoDB examples will not work
npm run mongo # windows
npm run mongo:unix # linux or mac

# run the backend
npm run app # windows
npm run app:unix # linux or mac
```

**NOTES**
- MongoDB examples needs MongoDB to work. To resolve, chose one of the methods to install MongoDB in **docs/mongodb/install.md**
- The **example-app/config/secret/*.inv,js** files not present. So there maybe some console log errors (but it is ok to ignore), graphql and websockets will not work. Quick start is still usable. Use the README.md to fill up

**Visit the following URLs**
- http://127.0.0.1:3000/api/healthcheck - app is running normally
- http://127.0.0.1:3000/api-docs - OpenAPI UI 
- http://127.0.0.1:3000 - Website served by Express with functional samples and demos (click on link to view **nobundle** app or link to view **vite production build** app)


### Nobundler

See above


### Webpack SPA Setup & Run - development environment

```bash
cd example-spa
npm i
npm run serve
```

Navigate to http://127.0.0.1:8080/spa to view application with VueCrudX demo 

Login using the following:
- User: test
- Password: test
- OTP (if enabled - e.g. USE_OTP=TEST): use 111111 as otp pin

### Vite SPA Setup & Run - development environment

[Why Use Vite](https://indepth.dev/a-note-on-vite-a-very-fast-dev-build-tool/)

MongoDB required for testing CRUD table to work

For Push Notification
- using Google FCM, setup your firebase account and messaging, also setup FCM server key in backend
- using self hosted webpush is also supported and available

```bash
cd example-vite
npm i
npm run dev
```

Navigate to http://127.0.0.1:8080/vite to view application

Login is same as SPA

You can test PWA Push notifications using Webpush or FCM () on Dashboard page depending on **.env.<environment>** file configuration (need to be on 127.0.0.1).

Click the following buttons in order (see their output in console.log and screen):
- sub PN (subscribe)
- Test PN (send a test message to user id 1 - on sqlite)
- Unsub PN (unsubscribe)

### Vite SPA Production Build

```bash
cd example-vite
npm run build
```

**example-app** should be running

Navigate to http://127.0.0.1:3000/vite/

### Webpack SPA production build

From vue-crud-x folder

```bash
cd example-spa
npm run build
```

**example-app** should be running

Navigate to http://127.0.0.1:3000/spa/

---

## Why No SSR or SSG

- potential slow rendering by server app, added complexity in code, rehydration errors, added complexity in server
- https://github.com/nuxt/nuxt.js/issues/8102
- prefer static sites and lazy loaded SPA

## SAML

Refer to link below on how to try out...
- https://github.com/ais-one/vue-crud-x/blob/develop/docker-devenv/saml/docker-compose.yml
- You can test out on the **example-vite** Signin UI, clicking on SAML button to see redirect callback

Codes are use in...
- https://github.com/ais-one/vue-crud-x/blob/develop/example-app/app.js
- https://github.com/ais-one/vue-crud-x/blob/develop/example-app/lib/express/saml.js
- https://github.com/ais-one/vue-crud-x/blob/develop/example-app/router/saml.js


## Testing

To run unit & integration test on /api/authors. E2E testing is **Work In Progress**

TO TEST EVERYTHING PLEASE change describe.only(...) to describe(...) in the test scripts in example-app/tests

```bash
npm run test # windows
npm run test:unix # linux or mac
```

## Long Running Processes and Cron Triggered Process

Command to run long process (do take note of caveats, for production need a monitor to handle restart strategy)

```bash
npm run process-long # windows
npm run process-long:unix # linux or mac
```

Command to simulate process triggered by cron (**NOTE:** may be better to use cron to call API than trigger a process)

```bash
npm run process-cron # windows
npm run process-cron:unix # linux or mac
```

---

## Using The Common Libraries In Your Own Application

1. **example-app** for backend example
  - **example-app/lib/esm** for common ESM codes to be used by express applications
  - **example-app/lib/<all_others>** for common CJS codes to be used by express applications

2. **example-nobundler** for vanillaJS frontend example

3. **example-vite** for Vite Vue3 frontend example
  - **example-vite/lib/rollup** for common codes to be used by Vite Vue 3 (should have same contents as **example-app/lib/esm**)

4. **example-spa** for Webpack Vue2 frontend example
  - **example-spa/lib/webpacked** for common codes to be used by Webpacked Vue 2 applications

5. **common-lib/esm** for common javascript libraries using ES Modules


## Environment Settings

- In **package.json** Files
  - Set environment using **config.env** property (development, uat, staging, production)

```json
{
  "config": {
    "env": "development",
  }
}
```

## Configuration

The **example-app/config/** folder contains the config information.

You can override the configurations using <NODE_ENV>.env.js files, e.g. development.env.js or uat.env.js in **example-app/config**

If too many config properties, split it to other more and files

---

## Project Strcuture

```
vue-crud-x
+- .circleci/ : not used
+- .github/ : github related CICD and automations
+- common-lib/ : common libraries
|  +- esm/ : es modules
+- docker-devenv/ : docker for development environment
+- docs/ : documentation
+- example-app/ : example backend - See example-app/README.md for Project Structure
+- example-nobundle/ : frontend associated to backend (Vue3 no bundle) - See example-nobundle/README.md for Project Structure
+- example-spa/ : frontend associated to the backend (Vue2 webpack) - See example-spa/README.md for Project Structure
|  +- lib/webpacked/ : webpacked components for frontend (e.g. VueCrudX.vue)
+- example-vite/ : frontend associated to backend - (Vue3 rollup) - See example-vite/README.md for Project Structure
|  +- lib/esm-rollup/ : rolled up components for frontend (e.g. apollo.js)
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
- Custom Element [docs/custom-element.md](docs/custom-element.md)
- Kafka [docs/kafka.md](docs/kafka.md) and code found in **example-app/sandbox**
- TCP Server [docs/tcp.md](docs/tcp.md) and code found in **example-app/sandbox**


## VERSION CHANGE NOTES

- **v0.4+** Improve folders and structure organization, handle CI/CD better
- **v0.3+** Reorganize folders and structure, for ease of developing and maintaining multiple applications.
- **v0.2+** uses Vuetify 2. Due to many breaking changes from Vuetify 1 to 2, CRUD component code was refactored to be more UI framework agnostic (reduce dependencies!), easier to use, improving code quality, documentation and <a href="https://dev.to/aisone/vuejs-expressjs-crud-cookbook-46l0" target="_blank">supprting article - VueJS+ExpressJS CRUD & Cookbook</a>
- **v0.1** and Vuetify 1 will be supported under the [v1 branch](https://github.com/ais-one/vue-crud-x/tree/v1). You can refer to the v1  <a href="https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054" target="_blank">Legacy Article (For Historical Reference)</a>


# SAMPLE SCREENSHOTS

## Login Screen

- recaptcha

[![Screenshot](./docs/images/login.png)](./docs/images/login.png)

## Table & Filter

- filter
- pagination

[![Screenshot](./docs/images/table.png)](./docs/images/table.png)

## Form

- custom form slot
- tags and lazy-load autocomplete
- click button to child table

[![Screenshot](./docs/images/form.png)](./docs/images/form.png)

## Inline Edit

- inline edit
- date-picker, select and other controls

[![Screenshot](./docs/images/inline.png)](./docs/images/inline.png)
