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

## Getting Started

### Install

```bash
# clone repo
git clone https://github.com/ais-one/cookbook.git
cd cookbook

# install dependencies for specific workspace projects
# see package.json for shortcut scripts
npm i --workspace=js-node/dbdeploy
npm i --workspace=js-node/services

# install for all workspace projects
npm i --workspaces
```

### Migrate DB And Seed DB

Go to [js-node/dbdeploy/README.md]() project and follow instructions for creating local development db on sqlite

**NOTES**

- MongoDB examples needs MongoDB to work. To resolve, chose one of the methods to install MongoDB in **docs/backend/mongodb/install.md**
- If some env entries are not present there maybe some console log errors (but it is ok to ignore) and websockets will not work. Quick start is still usable. Use the README.md to fill up

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

## VERSION CHANGE NOTES

- **v0.7+** Reorganize, improve and update see changelog for v0.7.0 details
- **v0.6+** Improve organization, graceful exit, logging, project rename, add more nodejs applications, repo name <u>vue-crud-x</u> changed to <u>cookbook</u>
- **v0.5+** Improve organization and authentication, add new features
- **v0.4+** Improve folders and structure organization, handle CI/CD better
- **v0.3+** Reorganize folders and structure, for ease of developing and maintaining multiple applications.
- **v0.2+** uses Vuetify 2. Due to breaking changes from Vuetify 1 to 2, CRUD component code was refactored to be more UI framework agnostic (reduce dependencies!), easier to use, improving code quality, documentation and <a href="https://dev.to/aisone/vuejs-expressjs-crud-cookbook-46l0" target="_blank">supprting article - VueJS+ExpressJS CRUD & Cookbook</a>
- **v0.1** and Vuetify 1 will be supported under the [v1 branch](https://github.com/ais-one/cookbook/tree/v1). You can refer to the v1 <a href="https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054" target="_blank">Legacy Article (For Historical Reference)</a>
