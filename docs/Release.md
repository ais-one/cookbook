### Version 0.2.2
- update packages
- add pm2 logging folders
- VueCrudX.vue minor bug fix _isHidden & _isReadOnly, use... ```&& !!this.selectedId``` instead of ```&& this.selectedId```
- VueCrudX.vue make export workable
- VueCrudX.vue minor fixes on UI, remove unnecessary horizontal scroll in form and filters when displaying more than 1 field in a row, padding adjustments
- improve date & time picker components
- exportCsv function change from hardcoded output filename to user definable

### Version 0.2.1
- update to Vuetify 2.0.1, & other packages
- fix form layouts
- make db init os agnostic

### Version 0.2.0
- update to Vuetify 2.0 (many breaking changes)
- vue-crud-x Version 0.1.x using Vuetify 1 to be supported in vue-crud-x [v1 branch](https://github.com/ais-one/vue-crud-x/tree/v1)
- redesign, improve and refactor **redesigned to make it easier to implement on other UI frameworks**
- consolidate examples, nuxt-example to focus mainly on nuxt issues only
- add JSDoc & OpenAPI support
- add SAML ADFS authentication example in backend example
- package updates
