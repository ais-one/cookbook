# Example Use of vite / vitepress

Let's see if we can use vite for a more-or-less real-life application

And let's try out vitepress

And also try out Vue 3 composition API

Use ESM libraries... this means no axios for now unless they have an esm build or use snowpack

## Vite

We should have the following
- Vuex
- VueRouter

[https://github.com/vuejs/vite](https://github.com/vuejs/vite)

# Setup

1. Install packages

```
npm i
```

2. For development Run from dev server

```
npm run dev
```

3. For production

```
npm run build
```

---

# Clean up

```
npm cache clean --force
rm -rf node_modules
rm package-lock.json
```


# Project Strcuture

```
+- public/
|  +- img/
|  |  +- icons/
|  |  +- splash/
|  +- static/
|  +- favicon.ico
|  +- firebase-messaging-sw.js
|  +- manifest.json
|  +- robots.txt
|  +- service-worker.js
|  +- sitemap.xml
|  +- style.css
+- deploy/ : contains deployment info & files see node-express/deploy/README.md
+- src/
|  +- components/
|  +- layouts/
|  +- lib/ : common libs
|  |  +- esm : JS that can be used by both front and backend
|  +- plugins/
|  +- views/
|  +- App.vue
|  +- main.js
|  +- queries.js
|  +- router.js
|  +- store.js
+- .env.development
+- .env.uat
+- .eslintignore
+- .eslintrc.js
+- .gitguardian.yml
+- .gitignore
+- .prettierrc.js
+- config.js
+- cypress.json
+- cypress.zip
+- deploy.sh
+- firebase.config.js
+- index.html
+- package.json
+- package-lock.json
+- pwa-init.js
+- README.md
+- vite.config.js
```
