# Example Use of vite / vitepress

**IMPORTANT - Moving this over to repository [https://github.com/ais-one/vue-crud-x](https://github.com/ais-one/vue-crud-x)

Let's see if we can use vite for a more-or-less real-life application

And let's try out vitepress

And also try out Vue 3 composition API

Use ESM libraries... this means no axios for now unless they have an esm build or use snowpack

## Vite

We should have the following
- Vuex
- VueRouter
- External non-ESM libraries (using snowpack) ??
- (TBD) Get some UI library - Buefy does not work with Vue 3 yet...

[https://github.com/vuejs/vite](https://github.com/vuejs/vite)


## Vitepress 

TBD [https://github.com/vuejs/vitepress](https://github.com/vuejs/vitepress)


# Shameless Plug

If this is interesting, look at my other project on github [https://github.com/ais-one/vue-crud-x](https://github.com/ais-one/vue-crud-x)


# Setup

1. Install packages

```
npm i
```

2. [REMOVED] Do snowpack to convert some of them to ES Modules, e.g. axios, moment

```
npx snowpack
```

3. For development Run from dev server

```
npm run dev
```

4. For production

```
npm run build
```

---

# Todo

- layouts
- drop-down menus (not in spec?)
- cards
- table

# Clean up

npm cache clean --force
rm -rf node_modules
rm package-lock.json
