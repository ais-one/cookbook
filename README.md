[![npm version](https://badge.fury.io/js/vue-crud-x.svg)](https://badge.fury.io/js/vue-crud-x) [![npm](https://img.shields.io/npm/dm/vue-crud-x.svg)](https://www.npmjs.com/package/vue-crud-x) [![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=com.lapots.breed.judge:judge-rule-engine&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.lapots.breed.judge:judge-rule-engine) [![Known Vulnerabilities](https://snyk.io/test/github/ais-one/vue-crud-x/badge.svg)](https://snyk.io/test/github/ais-one/vue-crud-x) [![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/vue-crud-x/shield-link)

# WHY

> Always Remember Rule #1 - Do Not Let Technical Debt Build Up

1. Ever wondered why you keep rewriting almost the same code when you work on full-stack applications?

2. Do you have trouble keeping the libraries in your different applications?

3. How often and how long do you spend fixing things when there is a version change in a dependency?

Well... what started as a CRUD component for VueJS has grown to a full-stack app development cookbook, and further expanded into a way of building and maintaining multiple full-stack applications of different use cases with as little waste as possible, aiming to address those 3 issues above as much as possible!

# NOTICES & UPDATES

Latest Version [0.3.2](https://github.com/ais-one/vue-crud-x/releases/tag/0.3.2) - Released 2020 Jun 30 1230 +8GMT

**vue-crud-x 0.3+** Reorganize folders and structure, for ease of developing and maintaining multiple applications.

**vue-crud-x 0.2+** uses Vuetify 2. Due to many breaking changes from Vuetify 1 to 2, we took the chance to make things better by designing component to be more UI framework agnostic (reduce dependencies!), easier to use, improving code quality, documentation and supporting [article](https://dev.to/aisone/vuejs-expressjs-crud-cookbook-46l0).

**vue-crud-x 0.1** and Vuetify 1 will be supported under the [v1 branch](https://github.com/ais-one/vue-crud-x/tree/v1). You can refer to the v1 [article](https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054).

# WHAT IS VUE-CRUD-X

**TL;DR** ExpressJS & VueJS Web App Cookbook And A Customisable CRUD Library

> A VueJS CRUD component which is customisable and extensible to suit more complex situations such as Nested CRUD, custom filters, forms, use of GraphQL or REST to access various datastores. Vuetify is used for frontend UI components but can be changed to alternatives such as ElementUI (with some effort)

> Over time, the example projects to show the use of **vue-crud-x** have grown to become a **cookbook** that includes many other useful **recipes** for use in production ExpressJS and VueJS web applications.

## Web App Cookbook Aims

1. As little technical debt as possible
2. Ease of maintenance and updates
3. Scalable in terms of application use cases (from v0.3 onwards)
4. Scalable in terms of traffic and load (in progress)
5. Ease of build, test, deployment, CI/CD, etc. (in progress)

## CRUD Unique Selling Points

The following differentiates vue-crud-x from other CRUD repositories:
- Able to do nested CRUD operations (parent table call child table),
- Server side pagination, sorting & filtering
- Handle infinite scroll use-case
- Handle authentication tokens, user permissions
- Customise table, search filter, CRUD form, validation, CRUD operations (call REST, GraphQL, Firestore, etc.)
- Inline edit (row level)
- Auto-configure/generate Search filter and CRUD Forms using JSON
- Export to CSV/JSON, File/Image Upload
- Reload & optimization strategy
- Real-time updates & subscription
- Overridable methods with default behaviour
- Emitted events for use by parent component

Other design considerations :
- i18n, l10n a11y
- Tree shaking, Lazy loading, Performance
- Implementation with multiple UI frameworks
  - remove as many UI framework dependent parts as possible
  - indacate parts which should change if other UI frameworks are used 
- Cleaner code with correct use of RxJS, async/await/Promises
- Prefer static generated sites, over SSR and SPA
- Automated unit & integration test


# QUICK START

1. Clone the repository, setup and run, using the following commands

```bash
git clone https://github.com/ais-one/vue-crud-x.git
cd vue-crud-x
npm run install-libs
npm run install-db
npm run dev:spa
```

2. VueJS example SPA Application

Navigate to http://127.0.0.1:8080 to view the VueCrudX demo and example SPA application in development

Login using the following:
- User: test
- Password: test
- OTP (if enabled): if USE_OTP set to TEST, use 111111 as otp pin

3. View example OpenAPI documentation at http://127.0.0.1:3000/api-docs

4. View website served by express at http://127.0.0.1:3000

The page contains functional samples and demos you can use to interact with the server

5. Testing

to run unit & integration test on /api/authors route

TO TEST EVERYTHING PLEASE change describe.only(...) to describe(...) in the test scripts in example-app/tests

```
npm run test
```

6. To serve the VueJS SPA production build

From vue-crud-x folder

```
cd example-app/web/spa
npm run build
```

Change the example-app/config/index.js file contents

```js
  //...
  WEB_STATIC: [
    //...
    { folder: 'example-app/web/spa/dist', url: '/' }, // uncomment this
    // { folder: 'example-app/public', url: '/' }, // comment this
    //...
  ]
  //...
```

7. Build another application

The new folder should reside inside vue-crud-x directory, e.g. 

Use the example-app to see how to build your own application

```
vue-crud-x/test-app
```

```
vue-crud-x/group/test-app1
vue-crud-x/group/test-app2
```

change **package.json** property **config.app** to point folder

e.g. for project **def** in vue-crud-x/abc/def the value in **package.json** should be

```json
{
  "config": {
    "app": "abc/def",
  }
}
```

e.g. for project **xyz** in vue-crud-x/xyz the value in **package.json** should be

```json
{
  "config": {
    "app": "xyz",
  }
}
```

Check the vue-crud-x/example-app/config.js to also see what should be change in the configs

8. VueJS example Nuxt SSR/Static Application

Run the **frontend** from one console...

From vue-crud-x folder

```
cd example-app/web/ssr
npm i
npm run dev
```

**Note:** for static content see example-ssr/README.md on generating and serving static content

Run the **backend** from another console... 

From vue-crud-x folder

```
cd example-app
npm run dev
```

9. PWA and vite

Work In Progress

10. Building & Deployment for Production (WIP)

From vue-crud-x folder

```
npm run build
```

runs the following scripts
- build.sh
- <example-app>/build-app.sh
- <example-app>/build-web.sh

places everything into vue-crud-x/**build** folder

node modules are not built

Use ssh, scp to deploy to vm, start / stop, check PM2 (TBD)

Use docker (TBD) -> User kubernetes (TBD)

---

# Project Strcuture

The project structure is shown below

```
vue-crud-x
+- common-app/ : common components
|  +- auth/ : for express authentication
|  +- common-webpack/ : common components for frontend (including vue-crud-x)
|  |  +- dist/ : distribution folder for CRUD component
|  +- comms/ : messging
|  +- esm/ : JS that can be used by both front and backend
|  +- express/ : express related
|  +- services/ : nodejs libs
|  +- app.js
|  +- appname.js
|  +- config.js
|  +- jest.config.js
+- docs/ : documentation
+- example-app : an example backend application
|  +- config/ : centralized config folder
|  |  +- certs/ : certificates for HTTPS and JWT signing
|  |  +- .env.<node_env>
|  |  +- index.js : home to your configs, can scale by adding folders and files
|  +- controllers/
|  +- coverage/ (auto-generated by test runner)
|  +- graphql/ : graphql stuff
|  +- jobs/ : message queue jobs
|  +- middlewares/
|  +- migrations/
|  +- models/
|  +- public/ : for serving static files - website
|  |  +- demo-express/ (127.0.0.1/)
|  |  +- demo-nobundler/
|  +- routes/
|  +- seeds/
|  +- tests/
|  +- uploads/ : for serving static files - files
|  +- web/ : frontend associated to the application
|  |  +- pwa/
|  |  +- spa/
|  |  +- ssr/
|  |  +- vite/
|  |  +- <your other front end here>
|  +- docker-compose.yml : docker stuff, [work in progress]
|  +- Dockerfile : docker stuff, [work in progress]
|  +- ecosystem.config.js
|  +- knexfile.js
|  +- package.json
|  +- README.md
+- <your other project folder here>: (you can use .gitignore in parent directory to hide this project)
+- logs/
+- .dockerignore
+- .eslintrc.json
+- build.sh
+- deploy.sh
+- index.js
+- LICENCE
+- package.json
+- README.md
+- RELEASE.md
```


## [spa](https://github.com/ais-one/vue-crud-x/tree/master/example-app/web/spa)

**Best for quick start** - Please use this to try things out. Everything runs locally

Recipes for a production-ready SPA:
- Example **vue-crud-x** usage
- REST and websockets
- Graphql (Apollo client, includes authentication, subscriptions, cache, optimistic UI, refetch queries)
- Login
  - recaptcha
  - Local Email-password login & JWT
    - optional 2FA OTP signin with Google Authenticator
      - setup with USE_OTP=GA in environement files of both the front and backend
      - Check DB seeders for the API key to use, or you can find out how to generate your own
- rxJs for cleaner code (auto-complete, debounce, fetch latest)
- upload to cloud provider using signed URLs
- Other Features
  - Image capture via webcam
  - Signature capture on canvas

## [backend](https://github.com/ais-one/vue-crud-x/tree/master)

Recipes for a production-ready Express server used by **example-app/web/spa** and **example-app/web/ssr**:
- ObjectionJS
  - Sample SQL DB with 1-1, 1-m, m-n use cases, transactions, migrations, seeders,
  - Supports SQLite, MySQL, MariaDB, Postgres, MSSQL
- MongoDB
  - seeders (migration not needed)
  - watch for real-time collection & document changes
- Authentication & Authorization
  - JWT (with RSA signatures) & 2FA OTP (using Google Authenticator), Refresh token, token in HttpOnly cookies
  - Local Login, OAuth2 Github Login, SAML ADFS login using Passport
- CORS, proxy middleware, helmet (securing express)
- Documentation
  - OpenAPI with JSDoc (enable for local only)
- Key-Value Store for user token storage on server (can replace with redis in production environment)
- Websocket (use https://www.websocket.org/echo.html & ngrok to test)
- GraphQL (use Apollo server)
- File uploads (to VM or to cloud storage via Signed URLs)
- Unit Test & Integration Test
- Logging
- Message queues


## [ssr](https://github.com/ais-one/vue-crud-x/tree/master/example-app/web/ssr)

Recipes for a production-ready Nuxt static sites. Static sites have the same advantages as SSR but are less complex to set up. The only thing to take care of is redirection of unknown dynamic routes:
- nuxt-auth (removed, use from example-spa instead due to... lack of refresh token, and possibly lack of httponly token capability - as at time of writing 21-11-2019)
  - Social login using Github
- nuxt-i18n (removed, the documents are more than sufficient for now)
- SSR & pre-generated Static Web App 
  - Handling of 500 and 404 errors
- Show gotchas of SSR

**IMPORTANT NOTE:** we use SSR mode, WITHOUT implementing the server side features for efficient debugging of static generated sites.

## [pwa](https://github.com/ais-one/vue-crud-x/tree/master/example-app/web/pwa)

- PWA
- Push Notifications

## [vite](https://github.com/ais-one/vue-crud-x/tree/master/example-app/web/vite)

Something new...

---

# DOCUMENTATION

**vue-crud-x** library documentation can be found in [docs/VueCrudX.md](docs/VueCrudX.md)

Roadmap and Release notes for the library and examples can be found in [Release.md](Release.md)

Documentation can be found starting at [docs/home.md](docs/home.md)

**vue-crud-x 0.2+ Article** <a href="https://dev.to/aisone/vuejs-expressjs-crud-cookbook-46l0" target="_blank">VueJS+ExpressJS CRUD & Cookbook</a>

**vue-crud-x 0.1 Article** <a href="https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054" target="_blank">Legacy Article (For Historical Reference)</a>


# SAMPLE SCREENSHOTS

## Login Screen

- recaptcha

[![Screenshot](./docs/images/login.png)](./docs/images/login.png)

## Table & Filter

- filter
- pagination

[![Screenshot](./docs/images/table.png)](./docs/images/table.png)

## Form

- custom form slot
- tags and lazy-load autocomplete
- click button to child table

[![Screenshot](./docs/images/form.png)](./docs/images/form.png)

## Inline Edit

- inline edit
- date-picker, select and other controls

[![Screenshot](./docs/images/inline.png)](./docs/images/inline.png)

---

## Configuration

Refer to **example-app/config/index.js**

If there are many config variables, you can split it up into other folders and files in the **example-app/config** folder

You can override the configuraions using .env.[NODE_ENV] files, e.g. .env.development or .env.production in **example-app**

### Making your own backend custom app

You can create your own folder with your custom app, **another-example-app-project**

Use the **example-app** as a template

### Choosing which backend custom app to run

in package.json, **config.app** property indicates the name of the app folder

The configuration value is passed into **appname.js**

The default is set to **example-app** you can change it to your own project name
