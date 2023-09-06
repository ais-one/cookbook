![master commit](https://badgen.net/github/last-commit/ais-one/cookbook/master)
![release](https://img.shields.io/github/v/release/ais-one/cookbook)
[![npm version](https://badge.fury.io/js/cookbook.svg)](https://badge.fury.io/js/cookbook)
[![npm](https://img.shields.io/npm/dm/cookbook.svg)](https://www.npmjs.com/package/cookbook)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=com.lapots.breed.judge:judge-rule-engine&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.lapots.breed.judge:judge-rule-engine)
[![Known Vulnerabilities](https://snyk.io/test/github/ais-one/cookbook/badge.svg)](https://snyk.io/test/github/ais-one/cookbook)
[![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/cookbook/shield-link)

### 1 - IMPORTANT - Read Me First!

The `templates` (express and vuejs template) and `libraries` (shareable libraries and tools) projects referenced in the [Recipes](recipes/README.md) are based on the two principles below.

### 1.1 - Updateable Templates

Your project is created using a template. If template updates, can upstream changes be merged with minimal impact on userland codes?

Yes and it is achieved through:
- Design
  - Create folder where all userland code is placed, template must NOT touch this folder
  - template should not to be part of a monorepo 
- Process
  - clone template and create remote called `upstream` pointing to template
  - update framework when necessary by merging `upstream` into `origin`

### 1.2 - Manageable Sharing

You have code shared between multiple projects and libraries. If the code is updated, is breaking dependents and dependencies avoidable?

Yes, based on the following principles:
- Shared libraries should be isolated and versioned. Use last-known-good version and update when ready
- Isolation and versioning can be extended to `types` (for Typescript) and `contracts` (for API)
- minimize inter & nested dependencies, and technical debt

---

### 2 - General Requirements

- git, github (for actions, secrets, etc) & IDE (e.g. vscode), Docker
- unix shell (Windows use git-bash or WSL2)
- node 18+ LTS & npm 9+ (npm i -g npm@latest `to update`)

### 3 - Sandbox

Research and exploration [Sandbox](sandbox/README.md)

### 4 - Docker Dev Env

Container setups for supporting apps for local development and testing [docker-devenv/README.md]()

### 5 - Documentation

The [docs](docs/home.md) folder contains useful information is in the midst of a major cleanup

### 6 - Useful scripts - For Use By Maintainers

- `bulk-git.sh`: script to diff, pull, push git (for repos in `recipies`)
- `bulk-npm.sh`: script to check for and/or update dependencies in package.json (for repos in `recipies`)
