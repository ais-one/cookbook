![master commit](https://badgen.net/github/last-commit/ais-one/cookbook/master)
![release](https://img.shields.io/github/v/release/ais-one/cookbook)
[![npm version](https://badge.fury.io/js/cookbook.svg)](https://badge.fury.io/js/cookbook)
[![npm](https://img.shields.io/npm/dm/cookbook.svg)](https://www.npmjs.com/package/cookbook)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=com.lapots.breed.judge:judge-rule-engine&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.lapots.breed.judge:judge-rule-engine)
[![Known Vulnerabilities](https://snyk.io/test/github/ais-one/cookbook/badge.svg)](https://snyk.io/test/github/ais-one/cookbook)
[![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/cookbook/shield-link)

# About

> **TL;DR** ExpressJS, VueJS, ReactJS cookbook, with evergreen recipes and templates (CRUD, CI/CD, QA, Testing, Cloud container deployment, Web Components, ES Modules, etc.) to develop applications faster, while reducing the need for rewrite or refactoring due to changes in dependencies.

Latest Version [0.7.0](https://github.com/ais-one/cookbook/releases/tag/0.7.0) - Released 2023 Sep 01 0830 +8GMT

**NOTE:**
See [CHANGELOG.md](CHANGELOG.md) for information on the changes in [0.7.0]

Ask for help and recommend improvements [here](https://github.com/ais-one/cookbook/discussions)

Considerations for this project are similar to [favv](https://github.com/ais-one/favv/blob/master/README.md#considerations). The difference between them are:
- this repo is more of a cookbook and recipes are constantly being improved and updated
- [favv](https://github.com/ais-one/favv) backend is written in Python, they can be used to improve on each other

# Features

Folder | Description | Features
---|---|---
@es-labs/esm | resuable ES module codes | moved to https://github.com/es-labs/esm
@es-labs/node | reusable common JS codes | moved to https://github.com/es-labs/node
[docker-devenv](docker-devenv) | Docker containers<br>supporting local development | Mongodb, Mysql, Keycloak(SAML/OIDC, etc IDP), Kafka, Hashicorp Vault, Redis
[docs](docs) | Documentation<br>To constantly improved/updated | - Main [documentation](docs/home.md)<br>- Secrets [documentation](docs/deployment/secrets.md)<br>- Deployment [notes](docs/deployment/home.md)<br>- Kafka [docs](docs/backend/kafka.md) and [code](js-node)<br>- TCP Server [docs](docs/backend/tcp.md) and [code](js-node)
[js-node/expressjs](js-node/expressjs) | **Base ExpressJS application**<br>(REST API, Websocket, etc) | - CORS, proxy middleware, helmet, error handling, logging, OpenAPI<br>- Objection ORM (**removed**), Knex, MongoDb, Relational DB data example, migration, seed, GraphQL, Redis<br>- Webpush & FCM push notification, Sendgrid email, Nexmo SMS, Telegram<br>- AgendaJS message queue<br>- Unit Test & Integration Test
[js-node/expressjs/apps/app-template](js-node/expressjs/apps/app-template) | Custom application (**app-template**)<br>built on [Base ExpressJS application](js-node/expressjs) | - [config] app configs<br>- [controllers] <br>- [models] <br>- [openapi] OpenAPI yamls<br>- [routes] API routes (also websocket handlers)<br>- [services] services to startup/shutdown<br>- [tables] config tables for generic table crud (t4t)<br>- [tests] folder for tests<br>- [graphql-schema.js] application GraphQL codes
[js-node/expressjs/public/demo-express](js-node/expressjs/public/demo-express) | Frontend to test backend features | - GraphQL, File uploads, Signed URL file upload to GCP Storage, websockets, SSE, webworkers (frontend demo)<br>- JWT using RSA, JWT refresh token, token in HttpOnly cookies, GA OTP, role, Passport SAML, OIDC<br>- Github OAuth2 login (setup - https://www.sohamkamani.com/blog/javascript/2018-06-24-oauth-with-node-js)<br>- Fido & Webauthn<br>- Push Notification (Webpush & FCM)
[js-node/*](js-node) | **Other Backend applications** | - [Services](js-node/services) (TCP event/stream, scalable Websocket with Redis Pubsub, etc.)<br>- [Serial server](js-node/serialserver)<br>- [openapi-file-joiner](js-node/openapi-file-joiner) combine OpenAPI files
[vue-nobundler](vue-nobundler/) | Vue 3 SPA no bundler + Bulma | - signed uploads, recaptcha<br>- **Web component table, form & CRUD backend** (files to note)<br><table><tr><td>[js-node/expressjs/apps/app-template/tables/](js-node/expressjs/apps/app-template/tables/)</td><td>sample custom app table configurations</td></tr><tr><td>[js-node/expressjs/router/t4t.js](js-node/expressjs/router/t4t.js)</td><td>handle backend CRUD API</td></tr><tr><td>[@es-labs/esm/t4t-fe.js](@es-labs/esm/t4t-fe.js)</td><td>frontend operations to interact with t4t.js</td></tr><tr><td>[@es-labs/esm/t4t-validate.js](@es-labs/esm/t4t-validate.js)</td><td>validation used by both front and backend</td></tr><tr><td>[@es-labs/esm/bwc-table](@es-labs/esm/bwc-table)</td><td>used to display table</td></tr><tr><td>[@es-labs/esm/bwc-t4t-form.js](@es-labs/esm/bwc-t4t-form.js)</td><td>form generated from table configurations</td></tr><tr><td>[vue-nobundler/views/ui1.js](vue-nobundler/views/ui1.js)</td><td>autcomplete, combobox, file upload example</td></tr><tr><td>[vue-nobundler/views/ui2.js](vue-nobundler/views/ui2.js)</td><td>table example</td></tr><tr><td>[vue-nobundler/views/ui3.js](vue-nobundler/views/ui3.js)</td><td>form example (with connection to backend)</td></tr><tr><td>[vue-nobundler/views/ui4.js](vue-nobundler/views/ui4.js)</td><td>table and form example (with connection to backend)</td></tr></table>
[js-web/vue-vite] | Vue 3 SPA using vite + Ant Design | - Leaflet Map, AntV Charts, PWA, Websockets, rxJS<br>- 2FA GA OTP, OIDC + Refresh, SAML, Github OAuth<br>- Web Components (Webcam, Signature)<br>- Playwrite Testing<br>- i18n / graphql (TBD)
<br>moved to https://github.com/ais-one/vue-antd-template
js-web/react-vite | - react<br>- react-router-dom<br>- zustand/@tanstack<br>- react-query | moved to https://github.com/ais-one/react-template
[.github/workflows](.github/workflows) | Github Actions (CI/CD) | - Manually Trigger<br>- On-push Trigger (WIP)
AMP Website | [removed](https://plausible.io/blog/google-amp) | -


# QUICK START - ON YOUR LOCAL MACHINE

## Requirements

- Node 16+ LTS
- Npm 8.3.2+ (using workspaces)
- For Windows, **integrate bash shell to cmd shell** (when installing git), or use git-bash
- Docker

**Updating npm on Windows**

npm i -g npm@latest

## Optional VS Code Plugins

**NOTE** Useful plugins if using VS Code:

- Essentials
  - Docker
  - Live Server
  - REST Client
  - SSH FS
  - MongoDB Client (official)
- Recommended
  - SonarLint (requires java)
  - GitLens
- JS Language Specific
  - es6-string-html
  - ESLint
  - Volar (for VueJS)
  - Prettier

## Chrome Extensions

- Web Server
  - https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/related?hl=en
- SAML / OIDC
  - https://chrome.google.com/webstore/detail/saml-ws-federation-and-oa/hkodokikbjolckghdnljbkbhacbhpnkb?hl=en
- React & Vue Dev tools
  - https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en
  - https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en
- MetaMask
  - https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en

## Other Utilities

- DB clients
  - dbeaver (mac / windows)
  - heidisql (windows)

## Download

```bash
# clone repo and install backend
git clone https://github.com/ais-one/cookbook.git
cd cookbook
```

## Installing & Updating Dependencies

Install dependencies for all workspaces!

Note
- when doing npm i, it will always install latest version matching your package
- sometimes you need to **rebuild**, delete all node_modules folders and the package-lock.json file in the root 

```bash
# https://github.com/npm/cli/issues/708
# https://github.com/npm/cli/issues/2032
npm i # use this
# npm i --legacy-peer-deps # use this if there is peer dependencies issues, but not recommended
```

Update dependencies for all workspaces!

```bash 
npm outdated # use this to check for outdated dependencies
npm update --save
npm ls <?package> # use npm ls to check on actual versions installed
```

## Single workspace command

```bash
# install specific dependencies
npm i lorem-ipsum --workspace=@<namespace>/[package]

# install all dependencies
npm i --workspace=js-node/expressjs

# Update a package with major version change eg 2.2.8 to 3.1.1
npm i ant-design-vue@latest --workspace=js-node/expressjs
```

---

## ExpressJS Backend Setup & Run - development environment

```bash
npm run app --workspace=js-node/expressjs -- development

# or

npm run ex:start
```

**NOTES**
- MongoDB examples needs MongoDB to work. To resolve, chose one of the methods to install MongoDB in **docs/backend/mongodb/install.md**
- The **js-node/expressjs/apps/app-template/config/secret/*.env.js** files are not present. So there maybe some console log errors (but it is ok to ignore) and websockets will not work. Quick start is still usable. Use the README.md to fill up

### Run migration & app

```bash
# create and seed relational db on SQLite, (delete the dev.sqlite file each time before you run this)
# command: npm run knex -- <development / uat / production> <custom app name> <seed / migrate>
npm run knex --workspace=js-node/expressjs -- development app-template migrate
npm run knex --workspace=js-node/expressjs -- development app-template seed

# create and seed MongoDB requires MongoDB - you can skip this but MongoDB examples will not work
# command: npm run mongo -- <development / uat / production> <custom app name> <seed / update>
npm run mongo --workspace=js-node/expressjs -- development app-template seed

# run the backend
# command: npm run app --workspace=js-node/expressjs -- <development / uat / production> <custom app name, default = app-template>
npm run app --workspace=js-node/expressjs -- development # app name implied (implied as app-template if not in env)
npm run app --workspace=js-node/expressjs -- development app-template # or app name specified
npm run app:lint --workspace=js-node/expressjs -- development app-template # to include eslint checks
```

**Visit the following URLs**
- http://127.0.0.1:3000/api/healthcheck - app is running normally
- http://127.0.0.1:3000 - Website served by Express with functional samples and demos
- http://127.0.0.1:3000/api-docs - OpenAPI documentation

Note: to generate api docs, visit [js-node/openapi-file-joiner](js-node/openapi-file-joiner) and follow readme file, also look at the config properties OPENAPI_PATH and OPENAPI_VALIDATOR in [js-node/expressjs/apps/app-template/config/common.env.js](js-node/expressjs/apps/app-template/config/common.env.js).

### No bundler frontend

See [vue-nobundler](vue-nobundler). Served from [http://127.0.0.1:3000/native/index.html](http://127.0.0.1:3000/native/index.html)

### Testing

- To run unit & integration test on **/api/categories** endpoint. E2E testing is **Work In Progress**
- TO TEST EVERYTHING PLEASE change describe.only(...) to describe(...) in the test scripts in **js-node/expressjs/apps/app-template/tests**

```bash
# run in development only
npm run test --workspace=js-node/expressjs -- development app-template
```

### Long Running Processes

For long running processes such as tcp server (event mode, streaming mode), serial server, kafka producer, consumer, cron-triggered process, etc.

See [js-node/README.md](js-node/README.md)

---

### Vite SPA Setup & Run - development environment

See [vue-antd-template project](https://github.com/ais-one/vue-antd-template).

## Why No SSR or SSG

- potential slow rendering by server app, added complexity in code, rehydration errors, added complexity in server
- https://github.com/nuxt/nuxt.js/issues/8102
- prefer static sites and lazy loaded SPA for now

## SAML, OIDC, OAuth

Refer to link below on how to try out...
- [Keycloak](docker-devenv/keycloak/README.md) README.md
- Refer also to the following files
  - [js-node/expressjs/router/saml.js](js-node/expressjs/router/saml.js)
  - [js-node/expressjs/router/oidc.js](js-node/expressjs/router/oidc.js)
  - [js-node/expressjs/router/oauth.js](js-node/expressjs/router/oauth.js) **requires setup of github account and config setup here**
- You can test out using the [vue-antd-template project](https://github.com/ais-one/vue-antd-template) Signin UI. See the README.md for details

---

## Fido2

Refer to following files for SPA sample (uses fido2-lib in backend)
- [js-node/expressjs/router/fido.js](js-node/expressjs/router/fido.js)
- [js-node/expressjs/public/demo-express/fido.html](js-node/expressjs/public/demo-express/fido.html)


## Push Notification
**Note:** For Push Notification
Refer to following files for SPA sample
- [js-node/expressjs/router/webpush.js](js-node/expressjs/router/webpush.js)
- [js-node/expressjs/public/demo-express/pn.html](js-node/expressjs/public/demo-express/pn.html)
- Uses Webpush or Google FCM
- Using Google FCM, setup your firebase account and messaging, also setup FCM server key in backend
- Using self hosted webpush is also supported and available
- You can test PWA Push notifications using Webpush or FCM on Dashboard page depending on **.env.<environment>** file configuration (need to be on 127.0.0.1).
- Click the following buttons in order (see their output in console.log and screen):
  - sub PN (subscribe)
  - Test PN (send a test message to user id 1 - on sqlite)
  - Unsub PN (unsubscribe)


## Configuration

The [js-node/expressjs/apps/app-template/config](js-node/expressjs/apps/app-template/config) folder contains the config information.

You can override the configurations using <NODE_ENV>.env.js files, e.g. **development.env.js** or **uat.env.js** in the folder

---

## Project Strcuture

es-lab dependencies
- [esm - shared es modules](https://github.com/es-labs/esm)
- [node - shared cjs modules](https://github.com/es-labs/node)

associated frontend project
- [vue-antd-template](https://github.com/ais-one/vue-antd-template)

```
+- .github/ : github related CICD and automations
+- .husky : git hooks
+- docker-devenv/ : docker for development environment
+- docs/ : documentation
+- js-node/ : nodejs applications (kafka, cron triggered, long running)
|  +- expressjs/ : express backend - See [js-node/expressjs/README.md](js-node/expressjs/README.md) for project structure
|  +- openapi-file-joiner/ : pre-process utility to combine openapi yaml files for use in openapi related packages
|  +- serialserver/
|  +- services/: TCP server, kafka, long running / cron processes
|  +- worker-threads/ : demo on use of worker threads
+- vue-nobundler/ : frontend (Vue3 no bundler) - See [vue-nobundler/README.md](vue-nobundler/README.md) for Project Structure
+- .editorconfig
+- .gitignore
+- BACKLOG.md
+- CHANGELOG.md
+- LICENCE
+- package.json
+- README.md
```

## CI/CD & Cloud Deployment

### Cloud Services

The following Google Cloud Platform (GCP) services are used
- Container Registry
- Cloud Run
- Cloud Storage
- Mongo Atlas (hosted on GCP)

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

## VERSION CHANGE NOTES

- **v0.7+** Reorganize, improve and update see changelog for v0.7.0 details
- **v0.6+** Improve organization, graceful exit, logging, project rename, add more nodejs applications, repo name <u>vue-crud-x</u> changed to <u>cookbook</u>
- **v0.5+** Improve organization and authentication, add new features
- **v0.4+** Improve folders and structure organization, handle CI/CD better
- **v0.3+** Reorganize folders and structure, for ease of developing and maintaining multiple applications.
- **v0.2+** uses Vuetify 2. Due to breaking changes from Vuetify 1 to 2, CRUD component code was refactored to be more UI framework agnostic (reduce dependencies!), easier to use, improving code quality, documentation and <a href="https://dev.to/aisone/vuejs-expressjs-crud-cookbook-46l0" target="_blank">supprting article - VueJS+ExpressJS CRUD & Cookbook</a>
- **v0.1** and Vuetify 1 will be supported under the [v1 branch](https://github.com/ais-one/cookbook/tree/v1). You can refer to the v1  <a href="https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054" target="_blank">Legacy Article (For Historical Reference)</a>
