![master commit](https://badgen.net/github/last-commit/ais-one/cookbook/master)
![release](https://img.shields.io/github/v/release/ais-one/cookbook)
[![npm version](https://badge.fury.io/js/cookbook.svg)](https://badge.fury.io/js/cookbook)
[![npm](https://img.shields.io/npm/dm/cookbook.svg)](https://www.npmjs.com/package/cookbook)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=com.lapots.breed.judge:judge-rule-engine&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.lapots.breed.judge:judge-rule-engine)
[![Known Vulnerabilities](https://snyk.io/test/github/ais-one/cookbook/badge.svg)](https://snyk.io/test/github/ais-one/cookbook)
[![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/cookbook/shield-link)

# About

> **TL;DR** ExpressJS, VueJS cookbook, with evergreen recipes and templates (CRUD, CI/CD, QA, Testing, Cloud container deployment, Web Components, ES Modules, etc.) to develop applications faster, while reducing the need for rewrite or refactoring due to changes in dependencies.

Latest Version [0.6.11](https://github.com/ais-one/cookbook/releases/tag/0.6.11) - Released 2022 Jul 22 0830 +8GMT

**NOTE:**
- `NestJS, ReactJS and Typescript` example projects `react-admin` and `nest-admin` have been moved to [https://github.com/ais-one/cookbook-ts](https://github.com/ais-one/cookbook-ts)
- `solid` project (SolidJS frontend) has been removed
- `cypress` E2E test replaced with `playwright`

Ask for help and recommend improvements [here](https://github.com/ais-one/cookbook/discussions)

Considerations for this project are similar to [favv](https://github.com/ais-one/favv/blob/master/README.md#considerations). The difference between them are:
- this repo is more of a cookbook and recipes are constantly being improved and updated
- [favv](https://github.com/ais-one/favv) backend is written in Python, they can be used to improve on each other

# Features

Folder | Description | Features
---|---|---
[@es-labs/esm](@es-labs/esm) | resuable ES module codes | Available as npm package also
[@es-labs/node](@es-labs/node) | reusable common JS codes | Available as npm package also
[docker-devenv](docker-devenv) | Docker containers<br>supporting local development | Mongodb, Mysql, Keycloak(SAML/OIDC, etc IDP), Kafka, Hashicorp Vault, Redis
[docs](docs) | Documentation<br>To constantly improved/updated | - Main [documentation](docs/home.md)<br>- Secrets [documentation](docs/deployment/secrets.md)<br>- Deployment [notes](docs/deployment/home.md)<br>- Kafka [docs](docs/backend/kafka.md) and [code](js-node)<br>- TCP Server [docs](docs/backend/tcp.md) and [code](js-node)
[js-node/expressjs](js-node/expressjs) | **Base ExpressJS application**<br>(REST API, Websocket, etc) | - CORS, proxy middleware, helmet, error handling, logging, OpenAPI<br>- Objection ORM (**removed**), Knex, MongoDb, Relational DB data example, migration, seed, GraphQL, Redis<br>- Webpush & FCM push notification, Sendgrid email, Nexmo SMS, Telegram<br>- AgendaJS message queue<br>- Unit Test & Integration Test
[js-node/expressjs/apps/app-template](js-node/expressjs/apps/app-template) | Custom application (**app-template**)<br>built on [Base ExpressJS application](js-node/expressjs) | - [config] app configs<br>- [controllers] <br>- [models] <br>- [openapi] OpenAPI yamls<br>- [routes] API routes (also websocket handlers)<br>- [services] services to startup/shutdown<br>- [tables] config tables for generic table crud (t4t)<br>- [tests] folder for tests<br>- [graphql-schema.js] application GraphQL codes
[js-node/expressjs/public/demo-express](js-node/expressjs/public/demo-express) | Frontend to test backend features | - GraphQL, File uploads, Signed URL file upload to GCP Storage, websockets, SSE, webworkers (frontend demo)<br>- JWT using RSA, JWT refresh token, token in HttpOnly cookies, GA OTP, role, Passport SAML, OIDC<br>- Github OAuth2 login (setup - https://www.sohamkamani.com/blog/javascript/2018-06-24-oauth-with-node-js)<br>- Fido & Webauthn
[js-node/*](js-node) | **Other Backend applications** | - [Services](js-node/services) (TCP event/stream, scalable Websocket with Redis Pubsub, etc.)<br>- [Serial server](js-node/serialserver)<br>- [openapi-file-joiner](js-node/openapi-file-joiner) combine OpenAPI files
[js-web/vue-nobundler](js-web/vue-nobundler) | Vue 3 SPA no bundler + Bulma | - signed uploads, recaptcha<br>- **Web component table, form & CRUD backend** (files to note)<br><table><tr><td>[js-node/expressjs/apps/app-template/tables/](js-node/expressjs/apps/app-template/tables/)</td><td>sample custom app table configurations</td></tr><tr><td>[js-node/expressjs/router/t4t.js](js-node/expressjs/router/t4t.js)</td><td>handle backend CRUD API</td></tr><tr><td>[@es-labs/esm/t4t-fe.js](@es-labs/esm/t4t-fe.js)</td><td>frontend operations to interact with t4t.js</td></tr><tr><td>[@es-labs/esm/t4t-validate.js](@es-labs/esm/t4t-validate.js)</td><td>validation used by both front and backend</td></tr><tr><td>[@es-labs/esm/bwc-table](@es-labs/esm/bwc-table)</td><td>used to display table</td></tr><tr><td>[@es-labs/esm/bwc-t4t-form.js](@es-labs/esm/bwc-t4t-form.js)</td><td>form generated from table configurations</td></tr><tr><td>[js-web/vue-nobundler/views/ui1.js](js-web/vue-nobundler/views/ui1.js)</td><td>autcomplete, combobox, file upload example</td></tr><tr><td>[js-web/vue-nobundler/views/ui2.js](js-web/vue-nobundler/views/ui2.js)</td><td>table example</td></tr><tr><td>[js-web/vue-nobundler/views/ui3.js](js-web/vue-nobundler/views/ui3.js)</td><td>form example (with connection to backend)</td></tr><tr><td>[js-web/vue-nobundler/views/ui4.js](js-web/vue-nobundler/views/ui4.js)</td><td>table and form example (with connection to backend)</td></tr></table>
[js-web/vue-vite](js-web/vue-vite) | Vue 3 SPA using vite + Ant Design | - Leaflet Map, AntV Charts, PWA, Websockets, rxJS<br>- JWT refresh token, 2FA GA OTP, OIDC, SAML, Github OAuth<br>- Web Components (Webcam, Signature)<br>- Cypress Testing
example-webpack<br><b>(Deprecated & removed)</b><br>[last updated version](https://github.com/ais-one/cookbook/tree/0.5.3) | Vue 2 SPA using webpack + Vuetify | - Graphql, REST, VueCrudX, i18n, rxJS
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
  - Prettier (disabled)

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

## Install for single workspace

```
npm i @vscode/sqlite3 --workspace=@es-labs/node
npm i lorem-ipsum --workspace=@es-labs/node
```

```bash
# updating from 2.2.8 to 3.1.1 - major version change
npm i ant-design-vue@latest --workspace=js-web/vue-vite
```

---

## ExpressJS Backend Setup & Run - development environment

```bash
npm run app --workspace=js-node/expressjs -- development
```

**NOTES**
- MongoDB examples needs MongoDB to work. To resolve, chose one of the methods to install MongoDB in **docs/backend/mongodb/install.md**
- The **js-node/expressjs/apps/app-template/config/secret/*.env,js** files are not present. So there maybe some console log errors (but it is ok to ignore) and websockets will not work. Quick start is still usable. Use the README.md to fill up

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

See [js-web/vue-nobundler](js-web/vue-nobundler). Served from [http://127.0.0.1:3000/native/index.html](http://127.0.0.1:3000/native/index.html)

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

1. See [js-web/vue-vite/README.md](js-web/vue-vite/README.md). To setup the configuration files. End-to-end testing example using playwright is here also.

2. Run the following

```bash
npm run dev --workspace=js-web/vue-vite
```

3. Visit
  - http://127.0.0.1:8080/ to view application
  - http://127.0.0.1:8080/nested/index.html to view another page (vite serving multi page, each page can be an SPA)

4. See [js-web/vue-vite/README.md](js-web/vue-vite/README.md) for more information on the `vue-vite` package


5. E2E Testing

```
npx playwright install chromium
npx playwright test --browser=chromium
```

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
- You can test out on the [js-web/vue-vite](js-web/vue-vite) Signin UI,
  - Use the following username / password credentials
    - for simple Login...
      - just clock on Login button, credentials test / test is already prefilled
      - then click on OTP button, the OTP 111111 is already prefilled
    - for SAML and OIDC... test-user / password
      - redirect to a keycloak IDP
    - for OAuth (Github), you need to configure your github settings (not recommended for starting out)
        - redirect to  github login
    - for Mock user login, just click on Mock button

---

## Fido2

Refer to following files for SPA sample (uses fido2-lib in backend)
- [js-node/expressjs/router/fido.js](js-node/expressjs/router/fido.js)
- [js-node/expressjs/public/demo-express/fido.html](js-node/expressjs/public/demo-express/fido.html)

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
|     +- traps.js
+- docker-devenv/ : docker for development environment
+- docs/ : documentation
+- js-node/ : nodejs applications (kafka, cron triggered, long running)
|  +- expressjs/ : express backend - See [js-node/expressjs/README.md](js-node/expressjs/README.md) for project structure
|  +- openapi-file-joiner/ : pre-process utility to combine openapi yaml files for use in openapi related packages
|  +- serialserver/
|  +- services/: TCP server, kafka, long running / cron processes
|  +- worker-threads/ : demo on use of worker threads
+- js-web
|  +- vue-nobundler/ : frontend (Vue3 no bundler) - See [js-web/vue-nobundler/README.md](js-web/vue-nobundler/README.md) for Project Structure
|  +- vue-vite/: frontend (Vue3 rollup) - See [js-web/vue-vite/README.md](js-web/vue-nobundler/README.md) for Project Structure
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
- .github/workflows/manual-gcp-vue-vite.yml (Manually deploy js-web/vue-vite to GCP Cloud Storage)
  - selectable inputs
    - environment (uat for now, development does not deploy anything)
    - csutom_app (to be implemented)
    - branch
- .github/workflows/manual-gh-pages.yml (Manually deploy js-web/vue-vite to Github Pages)
  - selectable inputs
    - environment (uat for now, development does not deploy anything)
    - csutom_app (to be implemented)
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

- **v0.6+** Improve organization, graceful exit, logging, project rename, add more nodejs applications, repo name <u>vue-crud-x</u> changed to <u>cookbook</u>
- **v0.5+** Improve organization and authentication, add new features
- **v0.4+** Improve folders and structure organization, handle CI/CD better
- **v0.3+** Reorganize folders and structure, for ease of developing and maintaining multiple applications.
- **v0.2+** uses Vuetify 2. Due to breaking changes from Vuetify 1 to 2, CRUD component code was refactored to be more UI framework agnostic (reduce dependencies!), easier to use, improving code quality, documentation and <a href="https://dev.to/aisone/vuejs-expressjs-crud-cookbook-46l0" target="_blank">supprting article - VueJS+ExpressJS CRUD & Cookbook</a>
- **v0.1** and Vuetify 1 will be supported under the [v1 branch](https://github.com/ais-one/cookbook/tree/v1). You can refer to the v1  <a href="https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054" target="_blank">Legacy Article (For Historical Reference)</a>
