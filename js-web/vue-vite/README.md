# Vue-Vite

A Vue 3 SPA using Ant Design Vue 2 and built with Vite 2

## Setup

From repo root, navigate to js-web/vue-vite folder

1. Copy application specific files

```
cp src/apps/web-template/deploy/.env.* .
cp src/apps/web-template/deploy/.apploader.js .
```

## Development Mode (using dev server)

**Note:** For Login
- Login using one of the following:
  - Mock: fake a user and login,  no backend needed
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

## End-to-end Testing

- Ensure that dev.sqlite is created and populated [running](../../README.md#run-migration--app), DO NOT RUN THE APP. JUST MIGRATE AND SEED DB.
- Ensure that MongoDB is [running](../../docker-devenv/mongodb/README.md).

```
npm run test:all:dev
```

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
|  |  +- web-<Your-Custom-Frontend>/: folder with prefix "-web" are your custom frontend code (your frontend repo)
|  |  +- web-template/
|  |     +- components/
|  |     +- deploy/ : contains custom deployment info & files see js-node/expressjs/deploy/README.md
|  |     +- layouts/
|  |     +- views/
|  |     |  +- DataEntry/
|  |     |  +- Demo/
|  |     |  +- Favv/ : requires https://github.com/ais-one/favv/ Fastapi backend
|  |     |  +- Visuals/
|  |     + setup.js: custom frontend setup (set INITIAL_SECURE_PATH, ROUTES CONSTANTS here)
|  |     + store.js: custom frontend store
|  |     + .gitignore: for your repo
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
+- tests/
+  +- example.spec.js
+- .env.development
+- .env.uat
+- .eslintignore
+- .eslintrc.js
+- .gitguardian.yml
+- .gitignore
+- .prettierrc.js
+- config.js
+- deploy.sh: to build into static folder for serving
+- firebase.config.js
+- index.html
+- package.json
+- package-lock.json
+- playwright.config.js
+- pwa-init.js
+- README.md
+- vite.config.js
```

---
## Frontend Custom Application Notes

Setting up your custom frontend

**Notes:**
- in **package.json**, default environment for `vite` command is `development`
- `.env.<environment>` and `apploader.js` files are specific to each application and found in `src/web<your-web-app>/deploy` folder, **they are copied to root folder** when switching app to work on
- **apploader.js** contains the app setup file to use
- `.env.[MODE]` indicates the environment file to use (command to use: npx vite build --mode $1)
- All folders and files prefixed with TBD can be ignored, they are not implemented and used for reference

```bash
# in js-web/vue-vite/src/apps
# note that project name must start with prefix "web-"
git clone <your frontend project e.g. web-example>
```
- see **js-web/vue-vite/.env.development** for defining vite.config.js and environment level (eg API URL) related configurations
- see **js-web/vue-vite/apploader.js** for loading custom frontend
- environment is selected using the --mode property (see package.json)
- use **js-web/vue-vite/src/apps/web-template/** as reference on your custom frontend
- see **js-web/vue-vite/src/apps/web-template/setup.js** on the frontend setup especially the ROUTES property
- ROUTES property
  - use kebab-case, will be converted to Capital Case in menu display
  - only up to 1 submenu level
    - /first-level
    - /submenu/second-level
  - paths
    - '~/xxx.js' from **js-web/vue-vite/src** folder
    - '/xxx.js' from **js-web/vue-vite** folder

---

## Notes

[Why Use Vite](https://indepth.dev/a-note-on-vite-a-very-fast-dev-build-tool/)
