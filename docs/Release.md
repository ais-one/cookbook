### Version 0.2.5
- update packages
  - vue-cli v4, eslint v6
- backend
  - [Work-in-progress] add jest test
  - improve on JWT, two ways to do expiry extension and revocation
    - still keyv use cache for revocation checking
    - [Work-in-progress] correctly implement expiry refresh token
    - add IP address checking
    - httponly session cookies, add proxy middleware to test (app and www must be seen to be from same IP/Domain and Port)
  - example of using RS256 for secret key (sample cert and key are in the certs folder)
  - rename api route /api/rest-test to /api/health, serves as health check, add /api/health-auth to test auth routes
  - improved on configuration (use common config.js file), renamed some configs
- [Work-in-progress] ant design version

### Version 0.2.4
- update packages
- VueCrudX
  - improve layout of table and forms, add to VueCrudX.md documentation
  - fixed issue with load more for infinite scroll (simplified process also)

### Version 0.2.3
- update packages
- VueCrudX
  - add vcx to onRowClick (so you can reference things in VueCrudX)
  - additional error check ```if (status === 200 && data)``` after this.crud.findOne call
  - add render function in Form Fields configuration to allow record field to be transformed to format used the input
- example-spa
  - fix major error when using firebase or mongo stitch
  - improve on configs, recaptcha moved to env file
  - fix firebase implemention, should use firebase/app, not @firebase/app

### Version 0.2.2
- update packages
- add pm2 logging folders
- VueCrudX.vue
  - bug fix _isHidden & _isReadOnly, use... ```&& !!this.selectedId``` instead of ```&& this.selectedId```
  - make export workable
  - minor fixes on UI, remove unnecessary horizontal scroll in form and filters when displaying more than 1 field in a row, padding adjustments
  - fix input parameters of crud updated() & created() overridable functions. change from **record** object (parameters passed into crud create() or update()) to **data** object (parameters returned from crud create() or update()). NOTE **created** AND **create**, **updated** and **update**...
  - minor fix change this.deleteRecord(...) to deleteRecord(...) in template
- improve date & time picker components
- example-spa/src/assets/util.js
  - exportCsv function change from hardcoded output filename to user definable (also to deprecate for improved function)
  - replace exportCsv, exportJson with downloadData (new function, works with IE and can handle larger filesize downloads in chrome)
  - replace makeCsvRow with more robust function from json2csv library

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
