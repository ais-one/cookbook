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

[https://github.com/vuejs/vite](https://github.com/vuejs/vite)


## Vitepress 

[https://github.com/vuejs/vitepress](https://github.com/vuejs/vitepress)


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
+- public/ :
|  +- img/ :
|  |  +- icons/ :
|  |  +- splash/ :
|  +- static/ : 
|  +- favicon.ico : 
|  +- manifest.json : 
+- secret/ :
+- src/ :
|  +- components/ :
|  +- layouts/ :
|  +- lib/ : common libs
|  |  +- esm : JS that can be used by both front and backend
|  +- plugins/ :
|  +- views/ :
|  +- App.vue :
|  +- main.js :
|  +- queries.js :
|  +- router.js :
|  +- store.js :
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
+- firebase-messaging-sw.js
+- firebase.config.js
+- index.html
+- package.json
+- package-lock.json
+- pwa-init.js
+- README.md
+- robots.txt
+- service-worker.js
+- sitemap.xml
+- style.css
+- vite.config.js
```
