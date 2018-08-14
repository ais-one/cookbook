[![npm version](https://badge.fury.io/js/vue-crud-x.svg)](https://badge.fury.io/js/vue-crud-x) [![npm](https://img.shields.io/npm/dm/vue-crud-x.svg)](https://www.npmjs.com/package/vue-crud-x) [![Gitter chat](https://badges.gitter.im/ais-one/gitter.png)](https://gitter.im/vuecrudx)

# IMPORTANT: Getting Started - Article

Read the following detailed article (usage and explanations in the article are also updated as and when required)

[https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054](https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054)


# What Is vue-crud-x

> A VueJS CRUD component which is customisable and extensible to suit more complex situations such as Nested CRUD, custom filters, use of GraphQL or REST to access various datastores. Vuetify is used for layout components but can be changed to alternatives such as ElementUI (by changing components from Vuetify to ElementUI)

## Differentiating Features From Other CRUD Components

 * Able to do nested CRUD operations, e.g. selecting a post from a list of posts, and then selecting a comment from a list of comments of the selected post to edit
 * Edit inline (New)
 * Include handling of authentication tokens, and any other information
 * Customise
   * Table data format for each cell (e.g., currency to 3 decimal places)
   * Search filters
   * CRUD Form layout & validation
   * CRUD operations (e.g. disallow delete)
 * For CRUD operations, you can Use direct call (e.g. Firestore), or API (REST, GraphQL) to one or more types of datastore (MySQL, MongoDB, Redis, ElasticSearch, etc.)
 * Export to CSV, File/Image Upload, i18n
 * Possibly replace Vuetify with something else like ElementUI, Buefy, etc.

## What is bad about this CRUD Component

Because of its flexible nature, quite a number of things need to be coded to fit your needs.

However, the good part is that these parts need to be coded anyway and once you find your way around the design, you will be able to quickly create custom CRUD in many of your use cases

# Getting Started - Hands On

## Learning To Use Or Maintaining Component (Github)

### Learning

#### clone the repository and go to the repository example
    git clone https://github.com/ais-one/vue-crud-x.git
    cd vue-crud-x/example

#### install dependencies
    npm install
    # delete package-lock.json if you face problems

#### create cfg.json file & put in your credentials
    touch cfg.json
    vi cfg.json

    {
      "firebaseCfg": {
        "apiKey": "",
        "authDomain": "",
        "databaseURL": "",
        "projectId": "",
        "storageBucket": "",
        "messagingSenderId": ""
      },
      "recaptchaSiteKey": ""  
    }

#### run the app (vue-cli 3)
    npm run serve

### Maintaining - Build NPM Package

#### go to repo root directory and build for production with minification
    cd [path-to]/vue-crud-x
    npm run build

#### Either upload as published package (only for repo owner)
    npm publish

#### local package vue-crud-x
    npm pack
    # A local npm package will be created (e.g. vue-crud-x-?.?.?.tgz file)
    # If you want to install without saving to package.json, npm i --no-save vue-crud-x-?.?.?.tgz


## General Usage

### Option 1 use NPM package

Install it as in NPM package and import it
    npm i vue-crud-x

### Option 2 use from source file

Just copy the VueCrudX.vue file into your project and include it as a component

# Todo / KIV
 * Pagination in example (with firebase)
 * Is it possible to make compatible with NuxtJS (route-link, to, nuxt-link)
 * add casl-vue, for casl authorization library
 * Configurable theme
 * Take note of the following github issues
   * Fixed Table Header:
     * https://github.com/vuetifyjs/vuetify/issues/1547
     * https://github.com/vuetifyjs/vuetify/pull/2868
     * https://github.com/vuetifyjs/vuetify/pull/3833
   * Infinite Scroll:  https://github.com/vuetifyjs/vuetify/issues/3538
 * No need vuelidate or vee-validate, use validation availble in Vuetify - see if it is possible to make common validation rules
 * Look into abort/timeout for async operations without abort/timeout feature

# Notes

None at the moment

# Changes

See RELEASE.MD file
