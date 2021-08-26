# Vue-Vite

A Vue3 SPA using Ant Design Vue UI and built using Vite

## Install

From repo root, navigate to js-web/vue-vite folder

1. Install packages

```
cd js-web/vue-vite
npm i
```

2. Copy apploader.js

This file specifies the folder containing the custom application

```
cp apploader.js.example apploader.js
```

## Development Mode (using dev server)

Run in development

```bash
npm run dev
```

Navigate to:
- http://127.0.0.1:8080/ to view application
- http://127.0.0.1:8080/nested/index.html to view another page (vite serving multi page, each page can be an SPA)

**Note:** For Login
- Login using one of the following:
  - Fast: fake a user and login,  no backend needed
  - Login: normal login with OTP, express server needs to be run
    - details already prefilled with following values
    - User: test
    - Password: test
    - OTP (if enabled - e.g. USE_OTP=TEST): use 111111 as otp pin
  - SAML: requires keycloak to be [setup](../../docker-devenv/keycloak/README.md) and run, express server needs to be run
  - OIDC: requires keycloak to be [setup](../../docker-devenv/keycloak/README.md) and run, express server needs to be run
  - OAuth: requires github account and app to be [setup](https://docs.github.com/en/developers/apps/building-oauth-apps) and also add github ID to a user in the [sqlite database](../../js-node/expressjs/dev.sqlite3), express server needs to be run

**Note:** For Push Notification
- Using Google FCM, setup your firebase account and messaging, also setup FCM server key in backend
- Using self hosted webpush is also supported and available
- You can test PWA Push notifications using Webpush or FCM on Dashboard page depending on **.env.<environment>** file configuration (need to be on 127.0.0.1).
- Click the following buttons in order (see their output in console.log and screen):
  - sub PN (subscribe)
  - Test PN (send a test message to user id 1 - on sqlite)
  - Unsub PN (unsubscribe)

## For production (served from localhost)

```
npm run build
```

Need to run **js-node/express** to serve the site on [http://127.0.0.1:3000/vite](http://127.0.0.1:3000/vite)

### Deploy to GCP Cloud Storage (uat environment)

```bash
cd js-web/vue-vite
./deploy.sh uat web-template
```

Details can be found in the **deploy.sh** file

Navigate to [https://uat.mybot.live](https://uat.mybot.live)


## Clean up

```
npm cache clean --force
rm -rf node_modules
rm package-lock.json
```

## Project Strcuture

```
+- cypress/
+- nested/ : testing for multi-html
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
+- src/
|  +- apps/
|  |  +- web-template/
|  |     +- components/
|  |     +- deploy/ : contains deployment info & files see js-node/expressjs/deploy/README.md
|  |     +- layouts/
|  |     +- views/
|  |        +- DataEntry/
|  |        +- Demo/
|  |        +- Visuals/
|  +- layouts/
|  +- plugins/
|  +- views/
|  |  +- setup.js : specify routes and other config info
|  |  +- store.js : store specific to this application (to use pinia)
|  +- App.vue
|  +- main.js
|  +- router.js
|  +- services.js
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

## Notes

[Why Use Vite](https://indepth.dev/a-note-on-vite-a-very-fast-dev-build-tool/)
