[![npm version](https://badge.fury.io/js/vue-crud-x.svg)](https://badge.fury.io/js/vue-crud-x) [![npm](https://img.shields.io/npm/dm/vue-crud-x.svg)](https://www.npmjs.com/package/vue-crud-x) [![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/vue-crud-x/shield-link)

# NOTICES & UPDATES

> Latest Version 0.2.0 Released 2019 July 20 0815 +8GMT
> Version 0.1.x will be supported under the V0.1 branch 

**Our next release, we will migrate to Vuetify 2.0...** There may be breaking changes as the new **v-data-table** component has more slot handling and features. We will take this chance to improve the framework while minimizing the effect of breaking changes

Roadmap and latest updates can be found on the <a href="https://github.com/ais-one/vue-crud-x/wiki" target="_blank">Wiki</a>.

See RELEASE.MD file for change history.

Read the following <a href="https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054" target="_blank">supporting article</a> (with usage and explanations updated as and when required)


## 0 QUICKSTART

- **example-rest** folder is preferred project for quickstart. Everything runs locally.
- **example-nuxt** folder uses NuxtJS (SSR and generate demo), Also includes Github login


## 1 New Features

- Rename example-firebase to example-baas and added Mongo Stitch login and query example
  - Setting up Mongo Stitch https://docs.mongodb.com/stitch/tutorials/guides/todo-backend/
  - Setup email and password authorization provider instead of anonymous provider
- Improved Nuxt page error handling using error layout page
- Vue 3 migration: updated slots to use v-slot


## 2 Major Improvements (Without Breaking Changes)

Usage example can be found:
 - in **example-rest** project (see example-rest/README.md on quickstart)
   - @/pages/Page.vue
   - @/pages/Book.vue
   - @/pages/Author.vue
   - @/pages/Category.vue
 - in **example-nuxt** project (see example-nuxt/README.md on quickstart)

---

# What Is vue-crud-x

> A VueJS CRUD component which is customisable and extensible to suit more complex situations such as Nested CRUD, custom filters, forms, use of GraphQL or REST to access various datastores. Vuetify is used for frontend UI components but can be changed to alternatives such as ElementUI (with some effort)

The following differentiates vue-crud-x from other CRUD repositories:
 - Able to do nested CRUD operations (parent table call child table),
 - Inline edit (row level)
 - Server side pagination, sorting & filtering
 - Handle infinite scroll use-case
 - Handle authentication tokens, user permissions
 - Customise table, search filter, CRUD form, validation, CRUD operations (e.g. disallow delete, call REST, GraphQL, Firestore, etc.)
 - Auto-configure/generate Search filter and CRUD Forms using JSON
 - Export to CSV/JSON, File/Image Upload
 - Reload & optimization strategy
 - Real-time updates & subscription
 - Overridable methods with default behaviour
 - Emitted events for use by parent component

Other design considerations 
 - i18n
 - Tree shaking
 - Implementation with multiple UI frameworks
   - remove as many UI framework dependent parts as possible
   - indacate parts which should change if other UI frameworks are used 
 - More modular design
 - Improvement on protocol
 - SSR and static generated sites for performance and SEO

The example projects include many useful paradigms and examples for you to use when building your full-stack application


## Example Project List

There are currently 3 projects for show-casing vue-crud-x and many other useful examples you may need in your software development journey

Our examples showcase the following (unrelated to the vue-crud-x features above)

 - **example-rest** (https://github.com/ais-one/vue-crud-x/tree/master/example-rest)
   - **(Best for quick start - Please use this to try things out)**
   - everything runs locally, and you build and run both this project and the **backend** project from here
   - websocket example
   - Graphql
     - use Apollo client
     - authentication
     - subscriptions
     - cache
     - optimistic response
     - refetch queries
   - real-time updates from Firestore
   - Use multiple vue-crud-x in single page
   - Additional
     - Image capture via webcam
     - Signature capture on canvas
   - Login
     - recaptcha
     - Local Email-password login & JWT
       - optional 2FA OTP signin with Google Authenticator
         - setup with USE_OTP=GA in environement files of both the front and backend
         - Check DB seeders for the API key to use, or you can find out how to generate your own
     - Mongo Stitch or Firebase Auth
   - Mongo stitch
     - refer to [docs/MongoStitch.md](docs/MongoStitch.md) for setup
     - login & auth
     - simple query example 
   - Firebase
     - refer to [docs/Firebase.md](docs/Firebase.md) for setup
     - login & auth
     - interaction with firebase datastore
     - upload to firebase storage & view
   - rxJs for cleaner code (auto-complete, debounce, fetch latest)
   - Serverless backend, using Firebase hosting backend-as-a-service, need to register and setup
 - **example-nuxt** (https://github.com/ais-one/vue-crud-x/tree/master/example-nuxt)
   - includes features in example-rest plus the following:
     - letting NuxtJS framework handle boilerplate work... e.g. routing, store setup
     - nuxt-auth
       - Social login using Github
       - Local Email-password login & JWT
         - optional 2FA using Google Authenticator
     - SSR & pre-generated Static Web App 


The **backend** project is an Express server used by **example-rest** and **example-nuxt** projects for testing the vue-crud-x component, and has the following features:
 - https://github.com/ais-one/vue-crud-x/tree/master/backend
 - ObjectionJS
   - Sample SQL DB with 1-1, 1-m, m-n use cases, transactions, migrations, seeders,
   - Supports SQLite, MySQL, MariaDB, Postgres, MSSQL
 - MongoDB
   - seeders (migration not needed)
   - watch for real-time collection & document changes
 - Authentication & Authorization
   - Local Login
   - JWT & 2FA OTP (using Google Authenticator)
   - OAuth2 Github Login
   - SAML ADFS login using Passport
 - OpenAPI documentation with JSDoc
 - Key-Value Store for user token storage on server (can replace with redis in local development environment)
 - Websocket (use https://www.websocket.org/echo.html & ngrok to test)
 - GraphQL (use Apollo server)
 - File uploads
 - Logging (in progress)
 - Testing (in progress)


Refer to the respective projects README.md files for more information

## Roadmap
 * Backend
   * Logging
   * Security Improvements
   * Automated testing (dredd.io)
   * improve on scalability of websockets
   * JsonSchema
 * Frontend
   * Validation? vuelidate, vee-validate, common validation
   * Testing (cypress)
 * Overall
   * CI / CD


## vue-crud-x API DOCUMENTATION

For more details on the attributes and events of vue-crud-x, please refer to [docs/VueCrudX.md](docs/VueCrudX.md)

---

## What is bad about this CRUD Component

Because of its flexible nature, quite a number of things need to be coded to fit your needs.

However, the good part is that these parts need to be coded anyway and once you find your way around the design, you will be able to quickly create custom CRUD in many of your use cases

---

# Building The Library (Read this if you wish to maintain own fork)

## Option 1 Use NPM package

Install it as an NPM package and import it

```bash
# Version 0.1.X
npm i ais-one/vue-crud-x#v1 --save

# Version 0.2.X
npm i vue-crud-x
```

## Option 2 Use the source file

Just copy the VueCrudX.vue file into your project and include it as a component

## Option 3 Build and Install

If you ever need to build this library from source...

1. Install dependencies

```bash
npm i
```

2. Build project (using vue-cli)

```bash
npm run build
```

The build output can be found in the **dist** folder


3. Publishing to npm (only for repo owner)

```bash
npm publish
```

4. Or build as local package vue-crud-x

```bash
npm pack
# A local npm package will be created (e.g. vue-crud-x-?.?.?.tgz file)
# If you want to install without saving to package.json, npm i --no-save vue-crud-x-?.?.?.tgz
```
