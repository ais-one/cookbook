# Vue-Vite

A Vue3 SPA using Ant Design Vue UI and built using Vite

## Install

From repo root, navigate to js-web/vue-vite folder

1. Install packages

```
cd js-web/vue-vite
npm i
```

## Development Mode (using dev server)

Run in development

```bash
npm run dev
```

Navigate to:
- http://127.0.0.1:8080/ to view application
- http://127.0.0.1:8080/nested/index.html to view another page (vite serving multi page, each page can be an SPA)

**Note:** For Push Notification
- using Google FCM, setup your firebase account and messaging, also setup FCM server key in backend
- using self hosted webpush is also supported and available

#### http://127.0.0.1:8080/ Application

Login using the following:
- User: test
- Password: test
- OTP (if enabled - e.g. USE_OTP=TEST): use 111111 as otp pin

You can test PWA Push notifications using Webpush or FCM on Dashboard page depending on **.env.<environment>** file configuration (need to be on 127.0.0.1).

Click the following buttons in order (see their output in console.log and screen):
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
./deploy.sh uat
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
+- deploy/ : contains deployment info & files see js-node/expressjs/deploy/README.md
+- src/
|  +- components/
|  +- layouts/
|  +- plugins/
|  +- views/
|  +- App.vue
|  +- main.js
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

## Notes

[Why Use Vite](https://indepth.dev/a-note-on-vite-a-very-fast-dev-build-tool/)
