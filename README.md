![master commit](https://badgen.net/github/last-commit/ais-one/cookbook/master)
![release](https://img.shields.io/github/v/release/ais-one/cookbook)
[![npm version](https://badge.fury.io/js/cookbook.svg)](https://badge.fury.io/js/cookbook)
[![npm](https://img.shields.io/npm/dm/cookbook.svg)](https://www.npmjs.com/package/cookbook)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=com.lapots.breed.judge:judge-rule-engine&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.lapots.breed.judge:judge-rule-engine)
[![Known Vulnerabilities](https://snyk.io/test/github/ais-one/cookbook/badge.svg)](https://snyk.io/test/github/ais-one/cookbook)
[![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/cookbook/shield-link)

### 1 - IMPORTANT - Read Me First!

### 1.1 - Updateable Templates

Your project is created using a template. If template has updates, can the upstream changes be managed with minimal impact on userland codes?

Yes and this is achieved through:
- Design
  - Create folder where all userland code is placed, template must NOT touch this folder
  - template should not to be part of a monorepo 
- Process
  - clone template and create remote called `upstream` pointing to template
  - update framework when necessary by merging `upstream` into `origin`

### 1.2 - Manageable Sharing

You have code shared between multiple projects and libraries. If the code is updated. Can you avoid breaking your dependents and dependencies?

Yes, based on the following principles:
- Shared libraries should be isolated and versioned, dependents can stay on last-known-good version and update when ready
- Isolation and versioning can be extended to `types` (for Typescript) and `contracts` (for API)
- minimize inter & nested dependencies, and technical debt

---

### 2 - General Requirements

- git, github (for actions, secrets, etc) & IDE (e.g. vscode), Docker
- unix shell (Windows use git-bash or WSL2)
- node 18+ LTS & npm 9+ (npm i -g npm@latest `to update`)

### 3 - Recipies

[Projects](recipies/README.md) that can be used (express and vuejs template, shareable libraries and tools)

- [Backend Template & Sample App](https://github.com/es-labs/express-template):
  - CORS, proxy middleware, helmet, error handling, logging, OpenAPI
  - Knex, MongoDb, Relational DB data example, migration, seed, GraphQL, Redis
  - Webpush & FCM push notification, Sendgrid email, Nexmo SMS, Telegram
  - AgendaJS (changing) message queue
  - Unit Test & Integration Test
  - startup/shutdown
  - config tables for generic table crud (t4t)
  - Simple frontend to test backend features
    - GraphQL, File uploads, Signed URL file upload to GCP Storage, websockets, SSE, webworkers
    - JWT using RSA, JWT refresh token, token in HttpOnly cookies, GA OTP, role SAML, OIDC
    - Github OAuth2 login (setup - https://www.sohamkamani.com/blog/javascript/2018-06-24-oauth-with-node-js)
    - Fido & Webauthn
    - Push Notification (Webpush & FCM)
  - Vue 3 SPA no bundler + Bulma
    - signed uploads, recaptcha, **Web component table, form & CRUD backend** (files to note)
    - @es-labs/esm/t4t.js: handle backend CRUD API<
    - @es-labs/t4t-fe.js: frontend operations to interact with t4t.js
    - @es-labs/t4t-validate.js: validation used by both front and backend
    - @es-labs/esm/bwc-table.js: used to display table
    - @es-labs/esm/bwc-t4t-form.js: form generated from table configurations
    - vue-nobundler/views/ui1.js: autcomplete, combobox, file upload example
    - vue-nobundler/views/ui2.js: table example
    - vue-nobundler/views/ui3.js: form example (with connection to backend)
    - vue-nobundler/views/ui4.js: table and form example (with connection to backend)
- [Frontend Template & Sample App](https://github.com/es-labs/vue-antd-template)
- [Reusable Components](https://github.com/es-labs/jscommon)
    - reusable CJS and ESM codes
    - tools such as DBdeploy

---

### 4 - Sandbox

Research and exploration [projects](sandbox/README.md)

### 5 - Docker Dev Env

Container setups for supporting apps for local development and testing [docker-devenv/README.md]()

### 6 - Documentation

The [docs](docs/home.md) folder contains useful information is in the midst of a major cleanup

### 7 - Useful scripts - For Use By Maintainers

- `bulk-git.sh`: script to diff, pull, push git (for repos in `recipies`)
- `bulk-npm.sh`: script to check for and/or update dependencies in package.json (for repos in `recipies`)

