/*
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test( userAgent );
}
// Detects if device is in standalone mode
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// Checks if should display install popup notification:
if (isIos() && !isInStandaloneMode()) {
}
*/

// console.log('FIREBASE SERVICE WORKER CODE START')
// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
var window = self // self is service worker - simulate it as window
importScripts('firebase.config.js') // FIREBASE_CONFIG
// console.log('FIREBASE_CONFIG self window', self)
importScripts('https://www.gstatic.com/firebasejs/7.21.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.21.0/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp(self.FIREBASE_CONFIG)

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging()
// [END initialize_firebase_in_sw]

messaging.setBackgroundMessageHandler(function (payload) {
  // console.log('[firebase-messaging-sw.js] Received background message ', payload)
  let notificationTitle = 'AHOP ALERT' + (new Date()).toLocaleDateString()
  let notificationOptions = { body: 'Updates Please Refresh' }
  try {
    // const { title = 'AHOP ALERT' + (new Date()).toLocaleDateString(), body = 'Updates. Please Refresh' } =
    const json = JSON.parse(payload.data.notification)
    const { title = null, body = null } = json
    if (title) notificationTitle = title
    if (body) notificationOptions.body = body
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
  // For root applications: just change "'./'" to "'/'"
  // Very important having the last forward slash on "new URL('./', location)..."
  const rootUrl = new URL('./', location).href
  event.notification.close()
  event.waitUntil(
    clients.matchAll().then(matchedClients => {
      for (let client of matchedClients) {
        if (client.url.indexOf(rootUrl) >= 0) {
          return client.focus()
        }
      }
      return clients.openWindow(rootUrl).then(function (client) { client.focus() })
    })
  )
})
/*
// Web Push Notifications
let clickOpenUrl
self.addEventListener('push', function (event) {
  let pushMessage = event.data.json()
  // push notification can send event.data.json() as well
  clickOpenUrl = pushMessage.notification.data.url
  const options = {
    body: pushMessage.notification.body,
    icon: pushMessage.notification.icon,
    image: pushMessage.notification.image,
    tag: 'alert'
  }
  event.waitUntil(self.registration.showNotification(pushMessage.notification.title, options))
})

self.addEventListener('notificationclick', function (event) {
  const clickedNotification = event.notification
  clickedNotification.close()
  if (clickOpenUrl) {
    const promiseChain = clients.openWindow(clickOpenUrl)
    event.waitUntil(promiseChain)
  }
})

//register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js')
    permissionRequest()
  });
}

function isSubscribed(){
  navigator.serviceWorker.ready.then(function(reg) {
    reg.pushManager.getSubscription().then(function(subscription) {
      console.log(subscription)

      app.service('subscription').find({
        query: {
          endpoint: subscription.endpoint
        }
      }).then(result=>{
        console.log ( 'issubscribed=>' , result )
        document.getElementById('isSubscribed').innerHTML = 'You need to susbscribe in order to receive notifications'
        document.getElementById('btnSubscribe').className = ''
        document.getElementById('btnUnsubscribe').className = 'hide'
        if ( result.total ) {
          document.getElementById('isSubscribed').innerHTML = 'You are subscribed!'
          document.getElementById('btnSubscribe').className = 'hide'
          document.getElementById('btnUnsubscribe').className = ''
        }
      }).catch(error=>{
        console.log ( error )
      })
    }).catch(error=>{
      console.log ( error )
      //_self.mysubscription = error
    })
  }).catch(error=>{
    console.log ( error )
    //_self.mysubscription = error
  })
}

function permissionRequest(){
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result)
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
  .then(function(permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error('We weren\'t granted permission.')
    }
  });
}

function urlB64ToUint8Array(base64String) {
  console.log ( base64String )
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function subscribe(){
  let self = this
  return navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(appServerKey)
      };
      return registration.pushManager.subscribe(subscribeOptions);
    }).then(function(pushSubscription) {
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
      app.service('subscription').create(pushSubscription)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      return pushSubscription;
    })
}

isSubscribed()
*/
