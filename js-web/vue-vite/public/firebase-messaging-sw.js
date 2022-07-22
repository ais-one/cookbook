// https://firebase.google.com/support/releases
// https://github.com/firebase/quickstart-js/tree/master/messaging

// const isIos = () => {
//   const userAgent = window.navigator.userAgent.toLowerCase();
//   return /iphone|ipad|ipod/.test( userAgent );
// }
// const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone); // Detects if device is in standalone mode
// if (isIos() && !isInStandaloneMode()) {} // Checks if should display install popup notification:

// console.log('FIREBASE SERVICE WORKER CODE START')
// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
const window = self // self is service worker - simulate it as window
importScripts('firebase.config.js')
importScripts('https://www.gstatic.com/firebasejs/9.8.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.8.2/firebase-messaging-compat.js')
// console.log('FIREBASE', firebase)

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp(self.CONFIG_FIREBASE_CLIENT)

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging()
// [END initialize_firebase_in_sw]

messaging.onBackgroundMessage(messaging, (payload) => {
  // console.log('[firebase-messaging-sw.js] Received background message ', payload)
  let notificationTitle = 'TEST ALERT' + new Date().toLocaleDateString()
  const notificationOptions = { body: 'Updates Please Refresh' }
  try {
    const json = JSON.parse(payload.data.notification)
    const { title = null, body = null } = json
    if (title) notificationTitle = title
    if (body) notificationOptions.body = body
    // NOSONAR
    // if (icon) notificationOptions.icon = './test.png'
    // notificationOptions.data = title + ' ' + body
  } catch (e) {
    console.log(e.toString())
    // notificationOptions.data = 'Updates. Please Refresh!!!'
  }
  // Customize notification here
  return self.registration.showNotification(notificationTitle, notificationOptions)
})

// console.log('FIREBASE SERVICE WORKER CODE END')
self.addEventListener('notificationclick', function (event) {
  // if (event.origin !== "http://example.org") return // check and reject if not correct origin

  // For root applications: just change "'./'" to "'/'"
  // Very important having the last forward slash on "new URL('./', location)..."
  const rootUrl = new URL('./', location).href
  event.notification.close()
  event.waitUntil(
    clients.matchAll().then((matchedClients) => {
      for (const client of matchedClients) {
        if (client.url.indexOf(rootUrl) >= 0) {
          return client.focus()
        }
      }
      return clients.openWindow(rootUrl).then(function (client) {
        client.focus()
      })
    })
  )
})
