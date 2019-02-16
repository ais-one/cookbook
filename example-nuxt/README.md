# example-nuxt

> A NuxtJS example project using vue-crud-x component

## Quick Start (default configuration used)

1. Install packages

```
npm i
```

2. Build REST Server (in backend folder) & Init DB (dev.dqlite3 in backend folder)

```
npm run build-rest
npm run init-db
```

3. SSR Application & Backend Server

```
npm run ssr
```

View the web application:
  - Host 127.0.0.1:8080
  - User: test
  - Password: test

4. Static Web Application & Backend Server

```
npm run generate
npm run static
```

## Configuration

Refer to .env-sample file for configuration keys to edit

Rename file to .env.development for development

Rename file to .env.production for production


For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).
