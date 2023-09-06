## Recipe 1 - [https://github.com/es-labs/express-template]()

An express app template

- CORS, proxy middleware, helmet, error handling, logging, OpenAPI
- Knex, MongoDb, Relational DB data example, migration, seed, GraphQL, Redis
- Webpush & FCM push notification, Sendgrid email, Nexmo SMS, Telegram
- AgendaJS (changing) message queue
- Unit Test & Integration Test
- startup/shutdown
- config tables for generic table crud (t4t)
- Simple frontend to test backend features
  - GraphQL, File uploads, Signed URL file upload to GCP Storage, websockets, SSE, webworkers
  - JWT using RSA, JWT refresh token, token in HttpOnly cookies, GA OTP, role SAML, OIDC
  - Github OAuth2 login (setup - https://www.sohamkamani.com/blog/javascript/2018-06-24-oauth-with-node-js)
  - Fido & Webauthn
  - Push Notification (Webpush & FCM)
- Vue 3 SPA no bundler + Bulma
  - signed uploads, recaptcha, **Web component table, form & CRUD backend** (files to note)
  - @es-labs/esm/t4t.js: handle backend CRUD API<
  - @es-labs/t4t-fe.js: frontend operations to interact with t4t.js
  - @es-labs/t4t-validate.js: validation used by both front and backend
  - @es-labs/esm/bwc-table.js: used to display table
  - @es-labs/esm/bwc-t4t-form.js: form generated from table configurations
  - vue-nobundler/views/ui1.js: autcomplete, combobox, file upload example
  - vue-nobundler/views/ui2.js: table example
  - vue-nobundler/views/ui3.js: form example (with connection to backend)
  - vue-nobundler/views/ui4.js: table and form example (with connection to backend)

## Recipe 2 - [https://github.com/es-labs/vue-antd-template]()

A VueJS Single-Page App (SPA) template using `vite` bundler and `ant design` UI framework

Why No SSR or SSG:
- potential slow rendering by server app, added complexity in code, concepts & deployment infra
- prefer static sites and lazy loaded SPA for now
- https://github.com/nuxt/nuxt.js/issues/8102

## Recipe 3 - [https://github.com/es-labs/jscommon]()

Common libraries and tools monorepo

The packages in the `libs` workspace are published to npm and are `shared`, `versioned`
- @es-labs/node : reusable CJS code for NodeJs and for express
- @es-labs/esm : reusable ES modules code
- Usage can be found in the template samples
  - [https://github.com/es-labs/express-template]()
  - [https://github.com/es-labs/vue-antd-template]()

The packages in `tools` workspace contain the following reusable/useful sample applications/tools
- dbdeploy: for DB migration and seeding

## Recipe 4 - [ReactJS Template](#)

TODO
