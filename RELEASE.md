### Version 0.0.15
 * now using vue-cli 3 scaffolding for example
 * update to vuetify 1.1.1
 * align filter apply icon to right (consistency)
 * add hasDuplicate check (for firestore) in example (party)
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
