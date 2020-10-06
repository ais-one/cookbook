// Chrome -> devtools -> Application -> Service Workers -> check Update on reload

// 'use strict';
// // Checking if we already have permission to send notifications
// const notificationsAllowed = await navigator.permissions.query({name: 'notifications'});
// if (notificationsAllowed.state !== 'granted'){
//   // Requesting permission
//   const permission = await Notification.requestPermission();
//   // If the permission is not granted the application won't work
//   if (permission !== 'granted') {
//   }
// }
// // Then you can continue with your notification driven code
import { firebase } from '@firebase/app'
import '@firebase/messaging'
// CONFIG_FIREBASE_CLIENT, CONFIG_VAPID_KEY is global from firebase.config.js

const pnMode = 'Webpush' // FCM, Webpush, empty string

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async function () {
    navigator.serviceWorker
      .register('/service-worker.js?params=' + encodeURIComponent(JSON.stringify({ a: 1, b: 2 })))
      .then((res) => console.log('service worker registered'))
      .catch((err) => console.log(err))

    // WebPush
    // We first get the registration
    console.log('pnMode', pnMode)

    if (pnMode === 'Webpush') {
    } else {
      // FCM
      firebase.initializeApp(CONFIG_FIREBASE_CLIENT)
      const messaging = firebase.messaging()
      messaging.usePublicVapidKey(CONFIG_VAPID_KEY)

      const permission = await Notification.requestPermission()
      if (permission === 'granted') window.GLOBAL_PN_TOKEN = await messaging.getToken()
      
      messaging.onTokenRefresh(async () => { window.GLOBAL_PN_TOKEN = await messaging.getToken() })

      messaging.onMessage((payload) => {
        console.log('Message received. ', payload)
        try {
          const { title, body } = JSON.parse(payload.data.notification)
          console.log(new Date().toISOString(), title, body)
        } catch (e) {
          console.log('GCM msg error', e.toString())
        }
      })
    }

    navigator.serviceWorker.addEventListener('message', (e) => {
      if (e && e.data && e.data.msg === 'pushsubscriptionchange') {
        // console.log(e.data.msg)
        window.GLOBAL_PN_TOKEN = JSON.stringify(e.data.sub)
      }
    })
  })
}
