[![npm version](https://badge.fury.io/js/vue-crud-x.svg)](https://badge.fury.io/js/vue-crud-x) [![npm](https://img.shields.io/npm/dm/vue-crud-x.svg)](https://www.npmjs.com/package/vue-crud-x) [![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/vue-crud-x/shield-link)

# NOTICES & UPDATES

> Latest Version 0.2.0 Released 2019 July 20 0815 +8GMT

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
   - example-rest/src/pages/Page.vue
   - example-rest/src/pages/Book.vue
   - example-rest/src/components/author.js
   - example-rest/src/pages/Category.vue
 - in **example-nuxt** project (see example-nuxt/README.md on quickstart)
 - in **example-baas** project
   - example-baas/src/pages/MultiCrud/Example.vue (also, demonstrates multiple vue-crud-x used in a single page)

---

# What Is vue-crud-x

> A VueJS CRUD component which is customisable and extensible to suit more complex situations such as Nested CRUD, custom filters, forms, use of GraphQL or REST to access various datastores. Vuetify is used for frontend UI components but can be changed to alternatives such as ElementUI (with some effort)

The following differentiates vue-crud-x from other CRUD repositories:
 - Able to do nested CRUD operations (parent table call child table),
 - Inline edit, pagination, sorting & filtering
 - Handle authentication tokens, user permissions
 - Customise table, search filter, CRUD form, validation, CRUD operations (e.g. disallow delete, call REST, GraphQL, Firestore, etc.)
 - Auto-configure/generate Search filter, CRUD Form from JSON
 - Export to CSV/JSON, File/Image Upload, i18n

## Example Project List

There are currently 4 projects for show-casing vue-crud-x. (Three frontend and one supporting backend example)

Our examples showcase the following (unrelated to the vue-crud-x features above)
 - in **example-rest**
   - **(Best for quick start - Please use this to try things out)**
   - everything runs locally, and you build and run both this project and the **backend** project from here
   - rxJs for cleaner code (auto-complete, debounce, fetch latest)
   - 2FA OTP signin with Google Authenticator (setup with USE_OTP=GA in environement files of both the front and backend. Check DB seeders for the API key to use, or you can find out how to generate your own)
   - websocket example
   - graphql example (use Apollo client: authentication, subscriptions, cache, optimistic response, refetch queries)
   - https://github.com/ais-one/vue-crud-x/tree/master/example-rest
   - Serverless backend, using Firebase backend-as-a-service, need to register and setup
   - real-time updates from Firestore
   - Use multiple vue-crud-x in single page
   - recaptcha
   - Additional
     - Image capture via webcam
     - Signature capture on canvas
   - Mongo stitch
     - login & auth
     - simple query example 
   - Firebase
     - login & auth
     - interaction with firebase datastore
     - upload to firebase storage & view
 - in **example-nuxt**
   - includes features in example-rest plus the following:
     - letting NuxtJS framework handle boilerplate work... e.g. routing, store setup
     - nuxt-auth
       - Social login using Github
       - 2FA login
     - SSR & pre-generated Static Web App 
     - https://github.com/ais-one/vue-crud-x/tree/master/example-nuxt

The **backend** project is an Express server used by **example-rest** and **example-nuxt** projects for testing the vue-crud-x component, and has the following features:
 - ObjectionJS + SQLite (Sample SQL DB with 1-1, 1-m, m-n use cases, transactions, migrations, seeders),
 - Login, JWT & 2FA OTP (using Google Authenticator)
 - OpenAPI documentation with JSDoc
 - Key-Value Store for user token storage on server (can replace with redis in local development environment)
 - Websocket (use https://www.websocket.org/echo.html & ngrok to test)
 - GraphQL (use Apollo server)
 - file uploads
 - MongoDB
 - SQLite
- https://github.com/ais-one/vue-crud-x/tree/master/backend


Refer to the respective projects README.md files for more information

## What is bad about this CRUD Component

Because of its flexible nature, quite a number of things need to be coded to fit your needs.

However, the good part is that these parts need to be coded anyway and once you find your way around the design, you will be able to quickly create custom CRUD in many of your use cases

---

# vue-crud-x DOCUMENTATION (Work-In-Progress)

---

# Building The Library (Read this if you wish to maintain their own fork)

## Option 1 Use NPM package

Install it as in NPM package and import it

```
npm i vue-crud-x
```

## Option 2 Use the source file

Just copy the VueCrudX.vue file into your project and include it as a component

## Option 3 Build and Install

If you ever need to build this library from source...

1. Install dependencies

```
npm i
```

2. Build project (using vue-cli)

```
npm run build
```

The build output can be found in the **dist** folder

**IMPORTANT NOTE: please rename the file VueCrudX.commmon.js to VueCrudX.js**

3. Publishing to npm (only for repo owner)

```
npm publish
```

4. Or build as local package vue-crud-x

```
npm pack
# A local npm package will be created (e.g. vue-crud-x-?.?.?.tgz file)
# If you want to install without saving to package.json, npm i --no-save vue-crud-x-?.?.?.tgz
```
