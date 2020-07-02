# example-ssr

> A NuxtJS example project using vue-crud-x component

## Quick Start (default configuration used)

See vue-crud-x main project README.md

### Static Web Application Generation

```
npm run generate
```

### Serving Static Web Application

```
npm run serve
```

## Configuration

Refer to config.js, nuxt.config.js

You can override the configuraions using .env.[NODE_ENV] files, e.g. .env.development or .env.production

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Notes

We build either only Static sites or SPA. SSR increases code and deployment complexity

Conecpts follow
- we debug as universal app (faster than generating all pages statically to debug)
- we do not use any server side features of nuxt
- we do not use any server side libraries, middleware, etc.
- code as close to VueJs as possible
- be aware of modules that you use (they take of SSR, if you only need client side, just use the libraries itself instead of nuxt modules)
- nuxt-auth is not ready for refresh token and httponly cookie tokens (as at 21/11/2019)
