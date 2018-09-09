[![npm version](https://badge.fury.io/js/vue-crud-x.svg)](https://badge.fury.io/js/vue-crud-x) [![npm](https://img.shields.io/npm/dm/vue-crud-x.svg)](https://www.npmjs.com/package/vue-crud-x) [![Gitter chat](https://badges.gitter.im/ais-one/gitter.png)](https://gitter.im/vuecrudx)

# IMPORTANT: Getting Started - Article

Read the following detailed article (usage and explanations in the article are also updated as and when required)

<a href="https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054" target="_blank">Article</a>

[https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054](https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054)


# What Is vue-crud-x

> A VueJS CRUD component which is customisable and extensible to suit more complex situations such as Nested CRUD, custom filters, use of GraphQL or REST to access various datastores. Vuetify is used for layout components but can be changed to alternatives such as ElementUI (by changing components from Vuetify to ElementUI)

## Examples To Get You Up And Running

See the respective README.md files for more information on starting

 * Serverless (best for starters) - https://github.com/ais-one/vue-crud-x/tree/master/example
 * REST (README.md work in progress) - https://github.com/ais-one/vue-crud-x/tree/master/example-rest
 * NUXT (README.md work in progress) - https://github.com/ais-one/vue-crud-x/tree/master/example-nuxt

## Differentiating Features From Other CRUD Components

 * Able to do nested CRUD operations, e.g. selecting a post from a list of posts, and then selecting a comment from a list of comments of the selected post to edit
 * Edit inline
 * Pagination, Use as component in a page
 * Include handling of authentication tokens, and any other information
 * Customise
   * Table data format for each cell (e.g., currency to 3 decimal places)
   * Search filters
   * CRUD Form layout & validation (can also be automated)
   * CRUD operations (e.g. disallow delete)
 * (Optional) Auto-configure Search filters, CRUD Forms using JSON data
 * For CRUD operations, you can Use direct call (e.g. Firestore), or API (REST, GraphQL) to one or more types of datastore (MySQL, MongoDB, Redis, ElasticSearch, etc.)
 * Export to CSV, File/Image Upload, i18n
 * (New) Permissions
 * Possibly replace Vuetify with something else like ElementUI, Buefy, etc.

## What is bad about this CRUD Component

Because of its flexible nature, quite a number of things need to be coded to fit your needs.

However, the good part is that these parts need to be coded anyway and once you find your way around the design, you will be able to quickly create custom CRUD in many of your use cases

---

# Todo / KIV
 * fix Date Range Issues... or check filters only on submit
 * GraphQL using Prisma or Hasura
 * Take note of the following github issues
   * Fixed Table Header:
     * Fixed Column: https://github.com/lzhoucs/vuetify/pull/4
     * https://github.com/vuetifyjs/vuetify/issues/1547
     * https://github.com/vuetifyjs/vuetify/pull/2868
     * https://github.com/vuetifyjs/vuetify/pull/3833
   * Infinite Scroll:  https://github.com/vuetifyjs/vuetify/issues/3538
 * Not Urgent: delete related records (e.g. deleting a party will also delete all notes belonging to that party)
 * Not Urgent: v-data-table actions-append: implement later, requires vuetifyjs 1.2.X
 * No need vuelidate or vee-validate, use validation availble in Vuetify - see if it is possible to make common validation rules
 * Look into abort/timeout for async operations without abort/timeout feature

# Notes

None at the moment

# Changes

See RELEASE.MD file
