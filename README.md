# IMPORTANT: Getting Started Article

Read the following detailed article to get started, I will be making changes to instructions there based on feedback as I do not want to keep pushing documentation changes to github and npm.

[https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054](https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054)

# What Is vue-crud-x

> A VueJS CRUD component which is customisable and extensible to suit more complex situations such as Nested CRUD, custom filters, use of GraphQL or REST to access various datastores. Vuetify is used for layout components but can be changed to alternatives such as ElementUI (by changing components from Vuetify to ElementUI)

## Differentiating Features From Other CRUD Components

* Able to do nested Crud
* Allow you to configure how to write the CRUD calls
  * find, findOne, update, edit, delete
  * if you set update, edit or delete custom functions that you write to null, it will not allow such operations
* Allow you to use any datastore(s) conection
  * example uses firebase, but you can adapt it to use others such
    * direct connection to store MySQL, Redis, postgres, mongodb, etc.
    * rest API
    * graphQL
  * you can even write to connect a mixture of multiple connections in a crud call
* Allow you to write how the CRUD Form will look like
* Allow you to write how the CRUD Filter will look like
* You can replace Vuetify with something else like ElementUI

## What is bad about this CRUD Component

Because of its flexible nature, quite a number of things need to be coded to fit your needs.

However, the good part is that these parts need to be coded anyway and once you find your way around the design, you will be able to quickly create custom CRUD in many of your use cases

## Build Setup For Maintaining This Repository (Github)

### clone the repository and go to the repository
    git clone https://github.com/ais-one/vue-crud-x.git
    cd vue-crud-x

### install dependencies
    npm install

### build for production with minification
    npm run build

### package vue-crud-x
    npm pack
    # A local npm package will be created (a tgz file)

### go to example & install
    cd example
    # install dependencies in package.json
    # delete package-lock.json if you face problems
    npm install
    # install the local npm package packed earlier... (but do not install into package json)
    npm install --no-save ../vue-crud-x-?.?.?.tgz
    # ?.?.? is the version

### create cfg.json file & put in your credentials
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

### run the app
    npm run dev


## General Usage (using NPM)

### 1 Init a project
    npm init

### 2 Install

> From NPM repo

    npm install --save vue-crud-x
    npm install --save regenerator-runtime

or

> From local package file

    npm i --save /path-to/vue-crud-x-?.?.?.tgz
    npm install --save regenerator-runtime

### 3 Running Example

    cd node_modules/vue-crud-x/example
    npm install

    # configure the cfg.json file
    npm run dev

Important! Please Refer to the Getting Started Article For Details: [https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054](https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054)

## Todo

* Customise colours and fonts...
* Add Locale
  * either use (vue-i18n / vee-validation) to store
* Take note of the following issues
  * Fixed Table Header: https://github.com/vuetifyjs/vuetify/issues/1547, https://github.com/vuetifyjs/vuetify/pull/2868
  * Infinite Scroll:  https://github.com/vuetifyjs/vuetify/issues/3538
* Look into abort/timeout for async operations without abort/timeout feature
* Check if it is possible to make compatible with NuxtJS
  * route-link, to, nuxt-link

## Changes

### Version 0.0.9
### Version 0.0.8
### Version 0.0.7

See Github Repo Release Notes


### Version 0.0.6

* Update to Vuetify 1.0.10
* Organize Layout (https://medium.com/@kasvith/multiple-layouts-for-vue-spa-app-fafda6b2bfc7)
* change userId (a single property) change to user object to allow more than one property to define a unique user
* Refactor and clean up firebase authentication in example
* Take note of Vuetify fixed header pull-request
  * https://github.com/vuetifyjs/vuetify/issues/1547
  * https://github.com/vuetifyjs/vuetify/pull/2868, https://github.com/vuetifyjs/vuetify/pull/3833


### Version 0.0.5

* Update to Vuetify 1.0.4
* fix async await issues in methods (forgot to add it to some dispatch functions)
* Add Export button function & example, included setTimeout IIFE to simulate poor network conditions (so that we can better handle it later)
* Add locale selection and locale state store (preparation for handling locale)

### Version 0.0.4

* Update to Vuetify 1.0.3
* Add file upload and image file upload sample form (ExampleForm.vue, it is not part of the crud, but can be included to the CRUD Form), file is uploaded to google cloud storage

### Version 0.0.3

* Update packages
* Fix example to handle updated Vuetify version 1.0.1

### Version 0.0.2

* Initial Release
