[![npm version](https://badge.fury.io/js/vue-crud-x.svg)](https://badge.fury.io/js/vue-crud-x) [![npm](https://img.shields.io/npm/dm/vue-crud-x.svg)](https://www.npmjs.com/package/vue-crud-x) [![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=com.lapots.breed.judge:judge-rule-engine&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.lapots.breed.judge:judge-rule-engine) [![Known Vulnerabilities](https://snyk.io/test/github/ais-one/vue-crud-x/badge.svg)](https://snyk.io/test/github/ais-one/vue-crud-x) [![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/vue-crud-x/shield-link)

# WHY

> Always Remember Rule #1 - Do Not Let Technical Debt Build Up
- Ever wondered why you keep rewriting almost the same code when you work on full-stack applications?
- Do you have trouble keeping the libraries in your different applications updated?
- How often and how long do you spend fixing things when there is a version change in a dependency?

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
3. Scalable in terms of application use cases & traffic load
5. Ease of build, test, deployment, CI/CD, etc.
6. https://12factor.net/


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


# QUICK START - ON YOUR LOCAL MACHINE

1. Clone the repository, setup and run, using the following commands

```bash
git clone https://github.com/ais-one/vue-crud-x.git
cd vue-crud-x
npm run install-libs
npm run install-db
npm run dev:spa
```

Navigate to http://127.0.0.1:8080 to view the VueCrudX demo and example SPA application in development

Login using the following:
- User: test
- Password: test
- OTP (if enabled): if USE_OTP set to TEST, use 111111 as otp pin

View example OpenAPI documentation at http://127.0.0.1:3000/api-docs

View website served by Express with functional samples and demos at http://127.0.0.1:3000

2. Testing

to run unit & integration test on /api/authors route

TO TEST EVERYTHING PLEASE change describe.only(...) to describe(...) in the test scripts in example-app/tests

```
npm run test
```

3. To serve the VueJS SPA production build

From vue-crud-x folder

```bash
cd example-app/web/spa
npm run build
```

Change the example-app/config/index.js file contents

```js
  //...
  WEB_STATIC: [
    //...
    { folder: APP_PATH + '/web/spa/dist', url: '/' }, // uncomment this
    // { folder: APP_PATH + '/public', url: '/' }, // comment this
    //...
  ]
  //...
```

4. VueJS example Nuxt SSR/Static Application

In vue-crud-x folder, run the **frontend** from one console...

```bash
cd example-app/web/ssr
npm i
npm run dev
```

**Note:** for static content see example-ssr/README.md on generating and serving static content

In vue-crud-x folder, run the **backend** from another console... 

```bash
cd example-app
npm run dev
```

5. PWA and vite

Work In Progress


---

# BUILDING A NEW APPLICATION

## Initial Creation - the master branch

```bash
mkdir <my-project>
cd <my-project>
git clone --depth=1 --branch=develop https://github.com/ais-one/vue-crud-x.git
# copy required files
cp vue-crud-x/deploy.sh vue-crud-x/setup.js vue-crud-x/package.json vue-crud-x/.eslintrc.json vue-crud-x/.gitignore vue-crud-x/.dockerignore vue-crud-x/update.sh .
# copy required folders
mv vue-crud-x/common-lib .
# you can copy the example-app below and use as reference
mv vue-crud-x/example-app .
# cleanup
rm -rf vue-crud-x
```

## Next Steps

- In **package.json**
  - Set application name in **config.app** property (indicate folder of your application - set to example-app if using example-app folder)
  - Set environment using **config.env** property (development, uat, staging, production)
- In **update.sh**
  - Uncomment the lines, this script is used to update the common library

```json
{
  "config": {
    "app": "example-app",
    "env": "development"
  }
}
```

## Configuration

<my-project>/example-app/config/index.js contains all the config properties.

If too many config properties, split it to other folders and files

You can override the configurations using .env.<NODE_ENV> files, e.g. .env.development or .env.production in **example-app/config/secret**


## Updating The Library - Use master branch

```
cd <my-project>
git clone -b develop https://github.com/ais-one/vue-crud-x.git
rm -rf common-lib
mv vue-crud-x/common-lib .
rm -rf vue-crud-x
```

## Manual Deployment (Work In Progress)

The following environments are supported:
- development (local laptop)
- uat (vm or cloud)
- staging (vm or cloud)
- production (vm or cloud)

For deployment to server or cloud, deploy.sh is example on how to do the following:
- build and deploy frontend SPA bundled code to GCP storage
- deploy express app to VM using SSH
  - transfer code to VM
  - install dependencies
  - startup and monitoring using PM2
- deploy express app to docker [TBD]
- deploy express app to GCP Group Instances [TBD]
- deploy express app to GKE [TBD]

```
npm run deploy
```

> work needs to be done on the organise and reference the setup documentation in the docs folder

## CircleCI Deployment (Work In Progress)

TBD

---

# Project Strcuture

The project structure is shown below

```
vue-crud-x
+- common-lib/ : common components
|  +- auth/ : for express authentication
|  +- comms/ : messging
|  +- esm/ : JS that can be used by both front and backend
|  +- express/ : express related
|  +- services/ : nodejs libs
|  +- webpacked/ : webpacked components for frontend (including vue-crud-x)
|  |  +- dist/ : distribution folder for CRUD component
|  +- app.js : the express app boilerplate
|  +- config.js: the base config
+- docs/ : documentation
+- example-app : an example backend application **Use this example for your project**
|  +- config/ : centralized config folder
|  |  +- certs/ : certificates for HTTPS and JWT signing
|  |  +- secret
|  |     +- .env.<node_env>
|  |  +- index.js : home to your configs, can scale by adding folders and files
|  +- controllers/
|  +- coverage/ (auto-generated by test runner)
|  +- graphql/ : graphql stuff
|  +- jobs/ : message queue jobs
|  +- logs/
|  +- middlewares/
|  +- migrations/
|  +- models/
|  +- public/ : for serving static files - website
|  |  +- demo-express/ (127.0.0.1/)
|  |  +- demo-nobundler/
|  +- router/
|  +- seeds/
|  +- tests/ : Jest tests
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
|  +- index.js
|  +- jest.config.js
|  +- knexfile.js
|  +- package.json
|  +- README.md
+- .dockerignore
+- .eslintrc.json
+- .gitignore
+- deploy.sh
+- LICENCE
+- package.json
+- README.md
+- RELEASE.md
+- setup.js
```


## [spa](https://github.com/ais-one/vue-crud-x/tree/master/example-app/web/spa)

**Best for quick start** - Please use this to try things out. Everything runs locally

Recipes for a production-ready SPA:
- Example **vue-crud-x** usage
- REST and websockets
- Graphql (Apollo client, includes authentication, subscriptions, cache, optimistic UI, refetch queries)
- Login
  - recaptcha
  - Local Email-password login, Github login & JWT
    - optional 2FA OTP signin with Google Authenticator
      - setup with USE_OTP=GA in environement files of both the front and backend
      - Check DB seeders for the API key to use, or you can find out how to generate your own
- rxJs for cleaner code (auto-complete, debounce, fetch latest)
- Upload to cloud provider using signed URLs
- Other Features
  - Image capture via webcam
  - Signature capture on canvas

## [backend & libs](https://github.com/ais-one/vue-crud-x/tree/master/common-lib/)

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
- Message queues (Bull, AgendaJS)
- No-bundler frontend demo


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
