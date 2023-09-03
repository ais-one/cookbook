## Description

### 1 [https://github.com/es-labs/express-template]()

An express app template

### 2 [(https://github.com/es-labs/vue-antd-template]()

A VueJS Single-Page App (SPA) template using `vite` bundler and `ant design` UI framework

Why No SSR or SSG:
- potential slow rendering by server app, added complexity in code, concepts & deployment infra
- prefer static sites and lazy loaded SPA for now
- https://github.com/nuxt/nuxt.js/issues/8102

### 3 [common libraries and tools monorepo](https://github.com/es-labs/jscommon)

The packages in the `libs` workspace are published to npm. They are shared, versioned, and used in the template app/web samples
- @es-labs/node : CJS code for NodeJs and for express
- @es-labs/esm : ES modules code

The packages in `tools` workspace contain the following useful sample applications
- dbdeploy: for DB migration and seeding

### 4 [ReactJS Template - TBD]()


