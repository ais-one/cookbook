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
