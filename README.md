![master commit](https://badgen.net/github/last-commit/ais-one/cookbook/master)
![release](https://img.shields.io/github/v/release/ais-one/cookbook)
[![npm version](https://badge.fury.io/js/cookbook.svg)](https://badge.fury.io/js/cookbook)
[![npm](https://img.shields.io/npm/dm/cookbook.svg)](https://www.npmjs.com/package/cookbook)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=com.lapots.breed.judge:judge-rule-engine&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.lapots.breed.judge:judge-rule-engine)
[![Known Vulnerabilities](https://snyk.io/test/github/ais-one/cookbook/badge.svg)](https://snyk.io/test/github/ais-one/cookbook)
[![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/cookbook/shield-link)

## IMPORTANT - Read Me First!

Your project is created using a template. If template has updates, can the upstream changes be managed without affecting userland codes?

You have code shared between multiple projects and libraries. If the code is updated. Can you avoid breaking your dependents and dependencies?


- Shared libraries should be isolated and versioned, dependents can stay on last-known-good version and update when ready
- Isolation and versioning can be extended to `types` (for Typescript) and API `contracts`
- Allow for an easy way to check for and update outdated dependencies in various projects

## Other General Requirements

- For Windows, **integrate bash shell to cmd shell** (when installing git), or use git-bash or WSL2
- git, github (for actions, secrets, etc) & IDE (e.g. vscode), Docker
- node 18+ LTS & npm 9+ (npm i -g npm@latest `to update`)

## Aims
- easily shared
- high reusability
- low technical debt
- low inter-dependency & nested-dependencies

## Resuable JS frameworks how to...

- updateable template design
  - exclude configurable files from repo (e.g. .env), but include sample (e.g. .env.sample)
  - create folder where all userland code is placed, template must NOT touch this folder

- app based on updateable templates
1. clone template repo
2. create a remote called upstream pointing to template repo
3. update framework when necessary by merging upstream into origin

updateable template repo is advisable not to be a monorepo




# About

> **TL;DR** ExpressJS, VueJS, ReactJS cookbook, with evergreen recipes and templates (CRUD, CI/CD, QA, Testing, Cloud container deployment, Web Components, ES Modules, etc.) to develop applications faster, while reducing the need for rewrite or refactoring due to changes in dependencies.

Latest Version [0.7.0](https://github.com/ais-one/cookbook/releases/tag/0.7.0) - Released 2023 Sep 01 0830 +8GMT. åSee changes history in [CHANGELOG.md](CHANGELOG.md) and discuss [here](https://github.com/ais-one/cookbook/discussions)




## Sandbox

### Install

```bash
# clone repo
git clone https://github.com/ais-one/cookbook.git
cd cookbook

# install dependencies for specific workspace projects
# see package.json for shortcut scripts
npm i --workspace=sandbox/<project folder name>

# install for all workspace projects
npm i --workspaces
```

## Project Strcuture

```
+- .github/ : github related CICD and automations
+- docker-devenv/ : docker for development environment
+- docs/ : documentation
+- git-hooks : git hooks
+- sandbox/ : prototyping & research --- scalable-websockets, kafka, cron triggered, long running processes
+- product/ : [TO-CHOOSE]...  (use a link to the repo or use submodule)
+- .editorconfig
+- .gitignore
+- bulk-git.sh : manage pull & push of repositories
+- bulk-npm.sh : manage check & update of dependencies (can probaby also use dependabot instead)
+- CHANGELOG.md
+- LICENCE
+- package.json
+- README.md
```

---


## Product

Companion Projects:
- Backend Template & Sample App:
  - [https://github.com/es-labs/express-template]()
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
- Frontend Template & Sample App:
  - [https://github.com/es-labs/vue-antd-template]()
- Reusable Components:
  - [https://github.com/es-labs/jscommon]()
    - reusable CJS and ESM codes
    - tools such as DBdeploy
- Python:
  - [https://github.com/ais-one/favv]() some of the API backend implemented in Python FastAPI
  - streamlit componennt examples


1. check dependencies
script to check for and/or update packages... if all repos are in the same project

2. update from upstream for templates