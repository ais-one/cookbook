### Upcoming
 * automated testing
 * example-nuxt - Nuxt (SPA first then transition to SSR) connecting to REST backend
 * RESTful++ Backend For Testing
   * Non-essential items
     * Multiple File upload example (to local folder)
     * Single File upload example (to firebase storage)
     * Graphql
     * Logging
     * Security Improvements
     * Social Logins
 * improve i18n
 * https://github.com/ais-one/vue-crud-x/issues/32
 * https://github.com/vuetifyjs/vuetify/pull/5232
 * GraphQL using Prisma or Hasura
 * Take note of the following github issues
   * Fixed Table Header:
     * Fixed Column: https://github.com/lzhoucs/vuetify/pull/4
     * https://github.com/vuetifyjs/vuetify/issues/1547
     * https://github.com/vuetifyjs/vuetify/pull/2868
     * https://github.com/vuetifyjs/vuetify/pull/3833
   * Infinite Scroll:  https://github.com/vuetifyjs/vuetify/issues/3538
 * No need vuelidate or vee-validate, use validation availble in Vuetify - see if it is possible to make common validation rules

### DEPRECATED CODE TO BE REMOVED IN v0.2.0
 * v0.1.4 - CRUD operations to return object instead of number
 * v0.1.3 - use 'field' instead of 'type' for Form and Filter inputs

### Version 0.1.7
 * note: example folder is now renamed as example-firebase
 * improvement: add form-open event - with data loaded when form opens
 * improvement: add scoped-slots for filter & edit form [IMPORTANT] please use this from now for customizing the CRUD, please see the following files for reference:
   * example-firebase/src/pages/MultiCrud/Example.vue
   * example-rest/src/pages/Book.vue
   * example-rest/src/pages/Page.vue
 * improvement: remove summary component (use scoped-slot instead)
 * improvement: code refactor in progress (make it easier to use)
 * done: (example-rest) - Vanilla VueJS connecting to REST backend)
   * improvement: Websocket (can use https://www.websocket.org/echo.html & ngrok to test)
   * improvement: use RxJS in example-rest/src/pages/Book.vue for debounce and fetch handling 
   * improvement: add transaction in DB query
 * chore: update npm packages (vuetify@1.4.4)
 * chore: update & improve documentation

### Version 0.1.6
 * chore: update npm packages (vuetify@1.4.3)
 * fix: (issue 44) metadata from firestore
 * work in progress: RESTful++ Backend For Testing
   * Priority Items
     * Done - Use ObjectionJS + SQLite for example, Mongo will have basic example with reconnect, and a simple find
     * Done - Login & OTP, Key-Value Store for user token storage on server (can replace with redis)
     * Done - Sample relational database implementation with (1-1, 1-m, m-n use cases) migrations, seeders, swagger documentation - Done
     * Done - Implementation of RESTful routes
   * Non-essential items
     * WIP - Websocket (use https://www.websocket.org/echo.html & ngrok to test)
     * TBD - Multiple File upload example (to local folder)
     * TBD - Single File upload example (to firestore)
     * TBD - Graphql
     * TBD - Logging
     * TBD- Security Improvements
     * TBD - Social Logins
 * work in progress: Frontend REST example
   * TBD - Nuxt (SPA first then transition to SSR)
   * TBD - Vanilla VueJS
 * chore: implement testing

### Version 0.1.5
 * chore: upgraded to vuetify 1.4.1
 * improvement: you can now customize table content, see @/pages/MultiCrud/Example.vue, Toggle Table button shows how it works
 * work in progress: REST API Example (merge Nuxt & REST example, use Nuxt SPA - decision still in progress)
   * Seperated backend code, so it can be used as an example backend various frontend projects
   * Important: deciding whether to use MongoDB or SQLite
   * Login - Done
   * Show table - In progress
   * Show nested table (one to many) - In progress
   * Show table (many to many) - In progress

### Version 0.1.4
 * NO BREAKING CHANGES
 * chore: upgraded to vuetify 1.3.11
 * improvement: hide vue-i18n warning messages - @/lang.js
 * improvement: you can return your own object for CRUD operations (see readme). return of hard-coded numbers will be DEPRECATED
 * improvement: you can customize toolbar buttons and optionally have text below toolbar button (space limited though) - see @/pages/Crud/party.js & @/pages/Crud/party-inline.js
 * improvement: create, update & delete events also emit the crudOps result (property named 'res'). if the operation did not return anything, res is undefined
 * improvement: [SOMEWHAT - NEEDS MORE TESTING] - fixed header [https://github.com/vuetifyjs/vuetify/issues/1547](https://github.com/vuetifyjs/vuetify/issues/1547)
 * improvement: allow user to hide filter button on toolbar (crudTable.showFilterButton = false)
 * work in progress: REST API Example
   * Login - Done
   * Show table - In progress
   * Show nested table (one to many) - In progress
   * Show table (many to many) - In progress

### Version 0.1.3
 * chore: upgraded to vuetify 1.3.8
 * improvement: add v-btn-toggle, grouped input [Alpha Version - Specification May Change]
 * improvement: [NON BREAKING CHANGE] please use 'field' instead of 'type' for Form & Filter inputs, 'type' will be deprecated
 * improvement: pass in 'this._self' as props to <crud-form> and <crud-filter> so that your custom forms or filters can access the parent vue-crud-x component
 * bug fix: confirmation dialog logic for update and create was wrong
 * bug fix: CRUD update permissions in saveRow
 * improvement: export csv now does not require id to be first column - @/assets/util.js
 * work in progress: REST API Example
   * Login - Done
   * Show table - In progress
   * Show nested table (one to many) - In progress
   * Show table (many to many) - In progress

### Version 0.1.2
 * bug fix: missing pleaseSave key in '@/lang', user needs to save changes or cancel them (by refreshing) before they can add inline record
 * bug fix: many inline save row issues (due to handling of realtime firebase snaphot updates, CRUD unaffected)
 * improvement: only save row if the row has been edited
 * improvement: add loaded event (when submitFilter() is called)
 * improvement: detect if i18n (multi-lang dependency) is present during mounted() of vue-crud-x and handle if not present
 * improvement: add time picker '@/TimePicker', improve date picker '@/DatePicker' (customize date format, prepend-icon now optional)
 * improvement: add realtime firebase in example project (Select "Real Time" on menu)
 * chore: clean up folder organization in example project
 * chore: improve documentation
 * work in progress: REST API Example
   * Login - Done
   * Show table - In progress
   * Show nested table (one to many) - In progress
   * Show table (many to many) - In progress

### Version 0.1.1
 * Removed wrongly installed dependencies in package.json
 * upgraded to vuetify 1.3.5
 * Add summary component (optional)
 * html in table cell & header cell
 * improve save row function by allowing background color to indicate change has been done on a cell in the row
 * fix CSV export function - use " (double quote) for field delimiter and escape "(double quote) using 2 "s
 * add JSON export (@/assets/util)
 * add secondary firebase app for auth user creation (@/firebase)
 * add editing object so as to indicate which rows user has edited inline and at what time (@/VueCrudX)
 (https://stackoverflow.com/questions/37517208/firebase-kicks-out-current-user/38013551#38013551)
 * [Work In Progress] REST API Example
   * Login - Done
   * Show table - In progress
   * Show nested table (one to many) - In progress
   * Show table (many to many) - In progress

### Version 0.1.0
 * first minor version change!
 * fixed bug in can() function which shows button even though flag is false
 * improved configurability & look-and-feel customization (spacing, color, alignment, etc.) of vue-crud-x
   * see party-inline.js crudTable property for full details (some properties and props have been removed)
   * crudTable.attrs shows the customizations for the various parts of the component
   * the attrs are not limited to what is in the party-inline.js file (details of this are explained in party-inline.js)
   * [BREAKING CHANGE] Action Column, now indicated in headers array instead of actionColumn flag, see party-inline.js
 * improve usability
   * make all buttons accessible, put them at top bar (done)
   * make top bar sticky - fixed (done - will need to revisit in Vuetify 2.0)
 * upgrade to vuetify 1.2.9 and updated outdated packages
 * [WORK IN PROGRESS] REST API example (with authorization & with configuration management)
   * jwt, google authenticator 2FA
   * knex, objectionjs, sqlite, keyv
   * update VueCrudX component in Nuxt example

### Version 0.0.24
 * updated packages & vuetify to 1.2.6
 * update to Nuxt example to use Nuxt 2.0
 * save row button for inline edit (reduce API calls)
 * add row button, allow popup for user to enter data for field/s before row is added (e.g. specify a date or name)
 * [Breaking Change - really sorry for this] use full component name for inline edit (v-select instead of select, so in future you can include your own)

### Version 0.0.23
 * [Major Breaking Change] improved Inline Edit, use attributes object with v-bind instead of hardcoding attributes
   * supports: v-text-field, v-select, v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker
   * all inputs need to use the new way of defining the objects
   * Example Usage: @/Components/Crud/party-inline.js
 * [MINOR breaking change] improved Auto-generated Filters and Forms, use attributes object with v-bind instead of hardcoding attributes
   * supports: v-text-field, v-select, v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker
   * v-select is broken and needs to use the new way of defining the objects
   * Example Usage: @/Components/Crud/party-inline.js
 * improve look of progress loaders
   * prefer to use linear progress bars rather than circular fullscreen dialog (especially, when you have multiple crud components in a page)
 * added WebCam and DrawingCanvas components in test page for example on capture of photo an signatures in a form
 * add autocomplete sample in test page (to be improved in future)
 * still using vuetify 1.2.3, as the popup dialog transparency from 1.2.4 is a problem

### Version 0.0.22
 * fix issue with inline edit where empty columns does not open dialog
 * Update project README.md and example README.md

### Version 0.0.21
 * user permissions
 * inline edit improvements, add v-datepicker to inline edit, have inline edit without using dialog (blur will update contents if it has been changed)
 * created DatePicker component in example that integrates v-text-field with v-date-picker, so you write less boilerplate code
 * move nuxt example from external repo to here...
 * move rest example from external repo to here...
 * clearble input (v-text-field in filter)

### Version 0.0.20
 * Move the doPage & crudTitle props into crudTable props as objects (breaking change on pagination flag)
 * update vuetify to 1.2.2
 * add textarea input type for inline edits
 * crud improvement
   * add actionColumn (if true, table row has edit/delete icons)
   * option to create new record via dialog (current & default behaviour) or by adding row
   * if you have actionColumn but no inline edit fields, clicking on row will emit 'selected' event
   * REST API example repository (https://github.com/ais-one/udemy/tree/master/vue-firebase)
   * Mutiple CRUD in a page
     * Working example on using parent and child table in same page
     * Scroll to top example included
   * half-sized filter inputs on wider screens (see halfSize property)
 * autogenerated filter if crudFilter's filterVue component is null & your filterData is properly populated
 * autogenerated form if crudForm's formAutoData is properly populated (still needs some improvements)
 * many customization on table look and feel
   * colors, action columns, dark or light theme
   * see party-inline.js for example settings and comments
 * FIXED: fix custom filters and forms in multi CRUD page (e.g. filter component gets overwritten)

### Version 0.0.19
 * pagination example (yes with firebase — only problem is that all records are loaded (e.g. 50 records) every time find is triggered, and page size is 5). Good thing is, you can use the example and it will work well on a DB supporting Total record count, Limit and Offset.
 * improve inline edit
 * use VueI18n for translations, and include Vuetify i18n
   * one for Vuetify
   * one for VueCrudX
   * the rest for your app
 * clean up firebase code, fix firestore duplicate check for update (thanks @gakera)
 * example implementation as component (you can use it on a page with charts or google maps, etc)
 * no breaking changes but... need to install vue-i18n
 * update vuetify to 1.1.12
 * firebase transactions and pagination example in party-inline.js
   * not really true server side pagination as limit / offset is expensive in firebase (skipped records are charged)
   * but it serves as a good example for server side pagination implementation
 * use HTTP status codes as CRUD operation result return values, for use with snackbar and calling function (non breaking change)
 * it is possible to work with NuxtJS (https://github.com/ais-one/nuxt-vcx)

### Version 0.0.18
 * update firebase packages & vuetify to 1.1.10
 * set vue-crud-x dependency tag to latest in example folder package.json
 * add snackbar to notify results of CRUD operations (configurable and can be disabled)
 * dynamic initial values (e.g. timestamp), see defaultRec implemented as function (no breaking change as you can still use defaultRec as object)
 * confimation for create / delete / update operations (confirmation can be individually disabled)
 * use native Javascript instead of Vuetify confirm dialog (reduce code and simplify code), will use Vuetify again once I can come up with simpler logic for it.
 * add inline-edit mode (use with care)

### Version 0.0.17
 * add progress indicator (thin line to upper part) to all async operations
 * use type="date" instead of datepicker, reduce code
 * enhanced filter example (Filter.vue example that auto generate filter fields from filter object)
 * update to vuetify 1.1.8
 * make image upload component (can also modify to be file upload)

### Version 0.0.16
 * now using vue-cli 3 scaffolding for example
 * update to vuetify 1.1.1

### Version 0.0.15
 * update to vuetify 1.0.19
 * align filter apply icon to right (consistency)
 * add hasDuplicate (for firestore) check in example (party)
 * add total record at top to search if non paged result

### Version 0.0.14
 * Major Bug Fix
   - Bad news, create operation does not populate record with default values (defaultRec)
   - Good news, you only need to update this component, you need not do anything on your custom code

### Version 0.0.13
 * add badges to README.MD
 * update to vuetify 1.0.17
 * add makeCsvRow helper in assets/util.js, see sample in the example application (just pass in an object from an array and get the CSV), some improvements still needed

### Version 0.0.12
* Improved on the schema example
  - Party collection (a party to lawsuit)
  - Notes collection (case notes on party)
  - 1 party can have 0 to N notes
  - in the example: click on party, select a party, there is a button to go to case notes of that party
* Align all icons right

### Version 0.0.11

* replace moment with date-fns
* update to vuetify 1.0.16
* remove unused packages vuefire & toastr, install vue-i18n
* add vue-i18n prop to pass into component & add functionality to example application (select language EN or ID, see 'no data' or 'confirm' text change)

### Version 0.0.9 & 0.0.10

* add a simpler select option example (found in the NotesFormS.vue & NotesFilterS.vue)
* disable recaptcha if testing on 127.0.0.1 or localhost
* improve example <select> - options load in created - and use API call to get select options...
* added party collection (for API call to load select options from the collection)
* add sort demo for 'Date Time' column of Note
* add exportCSV helper function in src/assets/util.js
* hide Save button if update function = null (for update record) or create function = null (for add record), and if comparison error if (id === null) to if (id)
* move images from /src/assets to /static
* 0.0.10 import crud component from npm instead of source

### Version 0.0.8
2018-04-11 2100 +8 GMT

* add hide-actions (toggle to enable or disable pagination)
* add disable button if form does not validate
* move user to Vuex (tokens can be stored in user object), remove addons object (breaking change - sorry for this, stupidity on my part)
* change go back icon to left pointing arrow instead of cross (less confusing as delete uses cross as well)
* improve date selection code - less clicks to do what you need to do

### Version 0.0.7
2018-04-10 2100 +8 GMT

* Update outdated dependencies
* Vuetify 1.0.13
* change lodash to lodash.clonedeep as we only need clonedeep
* add title to table form
* change jwtToken to token... (breaking change)

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
