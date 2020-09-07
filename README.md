[![npm version](https://badge.fury.io/js/vue-crud-x.svg)](https://badge.fury.io/js/vue-crud-x) [![npm](https://img.shields.io/npm/dm/vue-crud-x.svg)](https://www.npmjs.com/package/vue-crud-x) [![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=com.lapots.breed.judge:judge-rule-engine&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.lapots.breed.judge:judge-rule-engine) [![Known Vulnerabilities](https://snyk.io/test/github/ais-one/vue-crud-x/badge.svg)](https://snyk.io/test/github/ais-one/vue-crud-x) [![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/vue-crud-x/shield-link)

> **TL;DR** ExpressJS & VueJS Web App Cookbook, Customisable CRUD Library, CI/CD, Cloud Container Deployment, Web Components, ES Modules

Latest Version [0.3.5](https://github.com/ais-one/vue-crud-x/releases/tag/0.3.5) - Released 2020 Sep 07 2100 +8GMT

# Features

- Frontend Examples
  - **NEW** [Vite & Vue3](https://github.com/ais-one/vue-crud-x/tree/master/example-web/vite): Web Components, Leaflet Map, ECharts, [CRUD frontend](https://github.com/ais-one/vue-crud-x/tree/master/example-web/vite/components/CrudTable.vue) for [CRUD backend](https://github.com/ais-one/vue-crud-x/tree/master/example-app/router/t4t.js)
  - [SPA & Vuetify](https://github.com/ais-one/vue-crud-x/tree/master/example-web/spa): Websockets, Graphql (subscriptions, cache, optimistic UI, refetch queries), REST, VueCrudX, i18n, RxJS, 2FA login, Github social login, recaptcha, JWT refresh token, GA OTP, Webcam (WIP), Signature canvas (WIP)
  - [PWA](https://github.com/ais-one/vue-crud-x/tree/master/example-web/pwa): FCM push notification & PWA features
  - [SSR using Nuxt](https://github.com/ais-one/vue-crud-x/tree/master/example-web/ssr): Handling 500 and 404 errors, show gotchas of SSR
  - [Vanilla JS, ES Modules](https://github.com/ais-one/vue-crud-x/tree/master/example-app/public): No bundler, scalable VueJS Application , example codes (signed uploads, JWT refresh token, OTP)
- [Express JS Backend](https://github.com/ais-one/vue-crud-x/tree/master/example-app/) & [Common Libs](https://github.com/ais-one/vue-crud-x/tree/master/common-libs/)
  - Cors, proxy middleware, helmet, error handling, logging, OpenAPI
  - Objection ORM, Knex, MongoDb, Relational DB data example, migration, seed, GraphQL, Redis
  - FCM push notification, Sendgrid email, Nexmo SMS, Telegram
  - AgendaJS message queue
  - File uploads, Signed URL file upload to GCP Storage
  - Websockets, graphql
  - JWT using RSA, JWT refresh token, Passwort SAML (WIP), token in HttpOnly cookies, GA OTP, role
  - Unit Test & Integration Test
- Development & Deployment
  - [Docker setup](https://github.com/ais-one/vue-crud-x/tree/master/docker-devenv) of mongodb with replica set
  - [Documentation](https://github.com/ais-one/vue-crud-x/tree/master/docs): always work in progress and to be improved
  - [Deploy script](https://github.com/ais-one/vue-crud-x/tree/master/deploy.sh) to VM, GCP Cloud Run, GCP Storage (for SPA & static sites)

# QUICK START - ON YOUR LOCAL MACHINE

## Backend & SPA or Vite, PWA, SSR

### Backend Setup & Run

```bash
# clone repo and install backend
git clone https://github.com/ais-one/vue-crud-x.git
cd vue-crud-x
npm run install

# create and seed relational db on SQLite
npm run knex # windows
npm run knex:unix # linux or mac

# create and seed MongoDB requires MongoDB - you can skip this but MongoDB examples will not work
npm run mongo # windows
npm run mongo:unix # linux or mac

# run the backend
npm run app # windows
npm run app:unix # linux or mac
```

**Visit the following URLs**
- http://127.0.0.1:3000/api/healthcheck - app is running normally
- http://127.0.0.1:3000/api-docs - OpenAPI UI 
- http://127.0.0.1:3000 - Website served by Express with functional samples and demos at 

**NOTES**
- MongoDB examples needs MongoDB to work. To resolve, chose one of the methods to install MongoDB in **docs/mongodb/install.md**
- The **example-app/config/secret** folder is missing so there maybe some console log errors (but it is ok to ignore), graphql and websockets will not work. Quick start is still usable. To resolve, in **example-app/config** folder, rename **sample-secret** folder to **secret**. You can look at the readme inside **sample-secret** folder for more information
- The code below is important, calls setup and reading of configs. It is used in **example-app/index.js** and also used in **example-app/process-long.js** (long running process) and **example-app/process-cron.js**

```js
// index.js
require(require('path').join(process.cwd(), 'common-lib', 'setup')) // first thing to setup
require(LIB_PATH + '/config') //  first thing to include from LIB_PATH
```

### SPA Setup & Run

```bash
cd example-web/spa
npm i
npm run serve
```

Navigate to http://127.0.0.1:8080 to view application with VueCrudX demo 

Login using the following:
- User: test
- Password: test
- OTP (if enabled - e.g. USE_OTP=TEST): use 111111 as otp pin

### Vite Setup & Run

MongoDB required for testing CRUD table to work

```bash
cd example-web/vite
npm i
npm run dev
```

Navigate to http://127.0.0.1:8080 to view application. Just click login button


### PWA Setup & Run

For Push Notification to work, setup your firebase account and messaging, also setup FCM server key in backend

```bash
cd example-web/pwa
npm i
npm run serve
```

### Nuxt SSR/Static Application Setup & Run

```bash
cd example-web/ssr
npm i
npm run dev
```

**Notes**
- for static content see example-web/ssr/README.md on generating and serving static content
- Static sites have the same advantages as SSR but are less complex to set up. The only thing to take care of is redirection of unknown dynamic routes
- We use SSR mode, WITHOUT implementing the server side features for efficient debugging of static generated sites.


## Testing

E2E testing is **Work In Progress**

To run unit & integration test on /api/authors route.

TO TEST EVERYTHING PLEASE change describe.only(...) to describe(...) in the test scripts in example-app/tests

```bash
npm run test # windows
npm run test:unix # linux or mac
```

## Long Running Processes and Cron Triggered Process

Command to run long process (do take note of caveats, for production need a monitor to handle restart strategy)

```bash
npm run process-long # windows
npm run process-long:unix # linux or mac
```

Command to simulate process triggered by cron (**NOTE:** it may be better to use cron to call API rather than trigger a process)

```bash
npm run process-cron # windows
npm run process-cron:unix # linux or mac
```

## To serve the VueJS SPA production build

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
    { folder: process.cwd() + '/spa/dist', url: '/' }, // UNCOMMENT this line
    // { folder: APP_PATH + '/public/demo-express', url: '/' }, // COMMENT this line
    //...
  ]
  //...
```

---

# BUILDING A NEW APPLICATION

## Initial Creation - the master branch

```bash
mkdir <my-project>
cd <my-project>
git clone --depth=1 --branch=develop https://github.com/ais-one/vue-crud-x.git
# copy required files
cp vue-crud-x/deploy.sh vue-crud-x/update.sh vue-crud-x/package.json vue-crud-x/.eslintrc.json vue-crud-x/.gitignore .
# copy required folders
mv vue-crud-x/common-lib .
# copy docker related files
cp vue-crud-x/.dockerignore vue-crud-x/Dockerfile vue-crud-x/docker-compose.yml .

# copy the example-app for use as reference (optional)
mv vue-crud-x/example-app .
# copy the example-web for use as reference (optional)
mv vue-crud-x/example-web .
# cleanup
rm -rf vue-crud-x
```

## Next Steps

- In **package.json**
  - Set application name in **config.app** property (indicate folder of your application - set to example-app if using example-app folder)
  - Set web name in **config.web** property (indicate folder of your application - set to example-web if using example-web folder)
  - Set environment using **config.env** property (development, uat, staging, production)
- In **update.sh**
  - Uncomment the lines, this script is used to update the common library when needed

```json
{
  "config": {
    "env": "development",
    "app": "example-app",
    "web": "example-web"
  }
}
```

## Configuration

The **example-app/config/** folder contains the config information.

You can override the configurations using <NODE_ENV>.env.js files, e.g. development.env.js or uat.env.js in **example-app/config/secret**

If too many config properties, split it to other more and files


## Updating The Library WIP

See script **update.sh**

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
|  +- setup.js: setup globals
+- docker-devenv/ : docker for development environment (e.g. run redis, mongodb from here)
|  +- mongodb
+- docs/ : documentation
+- example-app : an example backend application **Use this example for your project**
|  +- config/ : centralized config folder
|  |  +- certs/ : certificates for HTTPS and JWT signing
|  |  +- k8s/ : kubernetes YAML files (WIP)
|  |  +- secret
|  |  |  +- .env.<node_env>
|  |  |  +- <node_env>.deploy
|  |  |  +- <node_env>.pem
|  |  |  +- <node_env>.gcp.json
|  |  |  +- <node_env>.gcp.cors.json
|  |  +- index.js : home to your configs, can scale by adding folders and files
|  +- controllers/
|  +- coverage/ (auto-generated by test runner)
|  +- db/
|  |  +- migrations/
|  |  +- mongo/
|  |  +- seeds/
|  +- graphql/ : graphql stuff
|  +- jobs/ : message queue jobs
|  +- logs/
|  +- middlewares/
|  +- models/
|  +- public/ : for serving static files - website
|  |  +- demo-express/ (127.0.0.1/)
|  |  +- demo-nobundler/
|  +- router/
|  +- tests/ : Jest tests
|  +- uploads/ : for serving static files - files
|  +- ecosystem.config.js
|  +- index.js
|  +- jest.config.js: JEST testing
|  +- knexfile.js: Knex query builder
|  +- package.json
|  +- process-long.js: sample long running process
|  +- process-cron.js: sample cron triggered process
|  +- README.md
+- example-web/ : frontend associated to the application
|  +- pwa/
|  +- spa/
|  +- ssr/
|  +- vite/
|  +- <your other front end here>
+- sandbox/ : Useful scripts
+- .dockerignore
+- .eslintrc.json
+- .gitignore
+- deploy.sh
+- docker-compose.yml
+- Dockerfile
+- LICENCE
+- package.json
+- README.md
+- RELEASE.md
+- update.sh
```

---

# DOCUMENTATION

Main documentation can be found starting at [docs/home.md](docs/home.md)

Roadmap and Release notes for the library and examples can be found in [Release.md](Release.md)

Other documents
- **vue-crud-x** library documentation can be found in [docs/VueCrudX.md](docs/VueCrudX.md)
- Deployment notes can be found in (docs/deployment/home.md)
- Custom Element [docs/custom-element.md](docs/custom-element.md)
- Kafka [docs/kafka.md](docs/kafka.md)
- TCP Server [docs/tcp.md](docs/tcp.md)

**vue-crud-x 0.2+ Article** 

## VERSION CHANGE NOTES

- **v0.3+**  Reorganize folders and structure, for ease of developing and maintaining multiple applications.
- **v0.2+** uses Vuetify 2. Due to many breaking changes from Vuetify 1 to 2, CRUD component code was refactored to be more UI framework agnostic (reduce dependencies!), easier to use, improving code quality, documentation and <a href="https://dev.to/aisone/vuejs-expressjs-crud-cookbook-46l0" target="_blank">supprting article - VueJS+ExpressJS CRUD & Cookbook</a>
- **v0.1** and Vuetify 1 will be supported under the [v1 branch](https://github.com/ais-one/vue-crud-x/tree/v1). You can refer to the v1  <a href="https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054" target="_blank">Legacy Article (For Historical Reference)</a>


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
