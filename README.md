![master commit](https://badgen.net/github/last-commit/ais-one/cookbook/master)
![release](https://img.shields.io/github/v/release/ais-one/cookbook)
[![npm version](https://badge.fury.io/js/cookbook.svg)](https://badge.fury.io/js/cookbook)
[![npm](https://img.shields.io/npm/dm/cookbook.svg)](https://www.npmjs.com/package/cookbook)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=com.lapots.breed.judge:judge-rule-engine&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.lapots.breed.judge:judge-rule-engine)
[![Known Vulnerabilities](https://snyk.io/test/github/ais-one/cookbook/badge.svg)](https://snyk.io/test/github/ais-one/cookbook)
[![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/cookbook/shield-link)

# About

> **TL;DR** ExpressJS, VueJS, ReactJS cookbook, with evergreen recipes and templates (CRUD, CI/CD, QA, Testing, Cloud container deployment, Web Components, ES Modules, etc.) to develop applications faster, while reducing the need for rewrite or refactoring due to changes in dependencies.

Latest Version [0.7.0](https://github.com/ais-one/cookbook/releases/tag/0.7.0) - Released 2023 Sep 01 0830 +8GMT. åSee changes history in [CHANGELOG.md](CHANGELOG.md) and discuss [here](https://github.com/ais-one/cookbook/discussions)

## IMPORTANT [Read Me First](https://github.com/es-labs/es-labs.github.io/wiki)

# QUICK START - ON YOUR LOCAL MACHINE

**Updating npm on Windows**

npm i -g npm@latest


## Getting Started
### Install

```bash
# clone repo
git clone https://github.com/ais-one/cookbook.git
cd cookbook

# install dependencies for specific workspace projects
# see package.json for shortcut scripts
npm i --workspace=js-node/expressjs
npm i --workspace=js-node/dbdeploy

# install for all workspace projects
npm i --workspaces

# OR install only for express backend
npm run build:win # see ./package.json scripts
```

### Migrate DB And Seed DB

Go to [dbdeploy](../dbdeploy/README.md) project and follow instructions for creating local development db on sqlite

### Run ExpressJS Backend - development environment

```bash
npm run ex:start # NODE_ENV=development npm run app --workspace=js-node/expressjs in package.json
# use ex:start:win for Windows OS

# OR to include eslint checks
NODE_ENV=development npm run app:lint --workspace=js-node/expressjs
```

**NOTES**
- MongoDB examples needs MongoDB to work. To resolve, chose one of the methods to install MongoDB in **docs/backend/mongodb/install.md**
- If some env entries are not present there maybe some console log errors (but it is ok to ignore) and websockets will not work. Quick start is still usable. Use the README.md to fill up


**Visit the following URLs**
- http://127.0.0.1:3000/api/healthcheck - app is running normally
- http://127.0.0.1:3000 - Website served by Express with functional samples and demos
- http://127.0.0.1:3000/api-docs - OpenAPI documentation

### No bundler frontend

- See [vue-nobundler]()
- Served from [http://127.0.0.1:3000/native/index.html]()
- import only vue & vue-router at index.html
- export const store = reactive({}) used [instead of Vuex](https://pinia.vuejs.org/introduction.html#Why-should-I-use-Pinia-)

### Testing

- To run unit & integration test on **/api/categories** endpoint. E2E testing is **Work In Progress**
- TO TEST EVERYTHING PLEASE change describe.only(...) to describe(...) in the test scripts in **js-node/expressjs/apps/app-sample/tests**

```bash
# run in development only
npm run test --workspace=js-node/expressjs -- development app-template
```

### Long Running Processes

For long running processes such as tcp server (event mode, streaming mode), serial server, kafka producer, consumer, cron-triggered process, etc.

See [js-node/README.md](js-node/README.md)

### Vite SPA Setup & Run - development environment

See [https://github.com/es-labs/vue-antd-template]().

Why No SSR or SSG:
- potential slow rendering by server app, added complexity in code, rehydration errors, added complexity in server
- https://github.com/nuxt/nuxt.js/issues/8102
- prefer static sites and lazy loaded SPA for now

---

## SAML, OIDC, OAuth

- SAML & OIDC: requires keycloak to be setup and express server to be run
  - Setup and Configure [Keycloak](docker-devenv/keycloak/README.md)
- You can test out on [sso.html](http://127.0.0.1:3000/sso.html). The file source is [js-node/expressjs/public/demo-express/sso.html]()
- for SAML and OIDC... credentials is `test` / `test`, redirect to the keycloak IDP
- Refer also to the following files
  - ./js-node/expressjs/router/saml.js
  - ./js-node/expressjs/router/oidc.js
  - ./js-node/expressjs/router/oauth.js **requires setup of github account and configs**

## Fido2

Refer to following files for SPA sample (uses fido2-lib in backend)
- [js-node/expressjs/router/fido.js]()
- [js-node/expressjs/public/demo-express/fido.html]()

## Push Notification
**Note:** For Push Notification
Refer to following files for SPA sample
- [js-node/expressjs/router/webpush.js]()
- [js-node/expressjs/public/demo-express/pn.html]()
- Uses Webpush or Google FCM
- Using Google FCM, setup your firebase account and messaging, also setup FCM server key in backend
- Using self hosted webpush is also supported and available
- You can test PWA Push notifications using Webpush or FCM on Dashboard page depending on **.env.<environment>** file configuration (need to be on 127.0.0.1).
- Click the following buttons in order (see their output in console.log and screen):
  - sub PN (subscribe)
  - Test PN (send a test message to user id 1 - on sqlite)
  - Unsub PN (unsubscribe)


## Configuration

- ./js-node/expressjs/.env
  - non-sensitive config values
- ./js-node/expressjs/.env.secret
  - values that are secret

- JSON values are supported
- For more sentitive configs, `Vault` service should be considered

---

## Project Strcuture

```
+- .github/ : github related CICD and automations
+- docker-devenv/ : docker for development environment
+- docs/ : documentation
+- git-hooks : git hooks
+- js-node/ : nodejs applications (db deployment, express API, scalable-websockets, kafka, cron triggered, long running processes) see [js-node/README.md]()
+- vue-nobundler/ : frontend (Vue3 no bundler) - See [vue-nobundler/README.md](vue-nobundler/README.md) for Project Structure
+- .editorconfig
+- .gitignore
+- BACKLOG.md
+- CHANGELOG.md
+- LICENCE
+- package.json
+- README.md
```

---

## CI/CD & Cloud Deployment

### Cloud Services

The following Google Cloud Platform (GCP) services are used
- Container Registry
- Cloud Run
- Cloud Storage

Refer to [doc/deployment/home.md](doc/deployment/home.md) for documentation on deployments

### Deployment Using Github Actions

- .github/workflows/manual-gcp-expressjs.yml (Manually deploy js-node/expressjs to GCP CloudRun)
  - selectable inputs
    - environment (uat for now, development does not deploy anything)
    - service (default = app-template)
    - branch

**NOTE** config/secret contents will not be in repo for CI/CD (so you can get errors), those should be put in VAULT

Current secrets
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

---

## VERSION CHANGE NOTES

- **v0.7+** Reorganize, improve and update see changelog for v0.7.0 details
- **v0.6+** Improve organization, graceful exit, logging, project rename, add more nodejs applications, repo name <u>vue-crud-x</u> changed to <u>cookbook</u>
- **v0.5+** Improve organization and authentication, add new features
- **v0.4+** Improve folders and structure organization, handle CI/CD better
- **v0.3+** Reorganize folders and structure, for ease of developing and maintaining multiple applications.
- **v0.2+** uses Vuetify 2. Due to breaking changes from Vuetify 1 to 2, CRUD component code was refactored to be more UI framework agnostic (reduce dependencies!), easier to use, improving code quality, documentation and <a href="https://dev.to/aisone/vuejs-expressjs-crud-cookbook-46l0" target="_blank">supprting article - VueJS+ExpressJS CRUD & Cookbook</a>
- **v0.1** and Vuetify 1 will be supported under the [v1 branch](https://github.com/ais-one/cookbook/tree/v1). You can refer to the v1  <a href="https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054" target="_blank">Legacy Article (For Historical Reference)</a>
