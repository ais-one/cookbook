// Chrome -> devtools -> Application -> Service Workers -> check Update on reload

// 'use strict';
// // Checking if we already have permission to send notifications
// const notificationsAllowed = await navigator.permissions.query({name: 'notifications'});
// if (notificationsAllowed.state !== 'granted'){
//   // Requesting permission
//   const permission = await Notification.requestPermission();
//   // If the permission is not granted the application won't work
//   if (permission !== 'granted') {
//     // I am a very sour developer so I replace all of my page with an error message
//     // DON'T DO LIKE ME AND BE A FRIENDLY DEV INSTEAD!
//     document.body.innerHTML = '<h1> This app can\'t work without notification bye </h1>';
//     return;
//   }
// }
// // Then you can continue with your notification driven code

// import config from '/firebase.config.js'
let pnMode = '' // FCM, Webpush, empty string

if (pnMode === 'FCM') {
  console.log('pnMode', pnMode)
  firebase.initializeApp(FIREBASE_CONFIG);
  const messaging = firebase.messaging();
  messaging.usePublicVapidKey(VAPID_KEY)
  
  const sendToken = (token) => {
    const query = { reply: 'yes' }  // yes=reply. no=no reply
    const qs = query ? '?' + Object.keys(query).map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(query[key])).join('&') : ''
    console.log('Sending Token', token)
    fetch('http://127.0.0.1:3000/api/test-pn-token/' + token + qs).then(res => {
      res.json().then(data => {
        console.log('send token response', data)
      })
    })
  }
  
  messaging.requestPermission().then(() => {
    messaging.getToken().then(async (token) => {
      sendToken(token)
    })
  })
  
  messaging.onTokenRefresh(() => {
    messaging.getToken().then(async (token) => {
      sendToken(token)
    })
  })
  
  messaging.onMessage((payload) => {
    console.log('Message received. ', payload)
    try {
      const { title, body } = JSON.parse(payload.data.notification)
      console.log((new Date()).toISOString(), title, body) 
    } catch (e) {
      console.log('GCM msg error', e.toString())
    }
  })
}


if ('serviceWorker' in navigator) {
  window.addEventListener("load", async function() {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log(err));

    // WebPush
    // We first get the registration
    if (pnMode === 'Webpush') {
      console.log('pnMode', pnMode)
      const registration = await navigator.serviceWorker.ready;
      // Asking for the subscription object
      let subscription = await registration.pushManager.getSubscription();
      // If we don't have a subscription we have to create and register it!
      if (!subscription) {
        subscription = await subscribe(registration);
      }
      // TBD Implement... unsub
    }
  })
}

// WebPush

// We use this function to subscribe to our push notifications
// As soon as you run this code once, it shouldn't run again if the initial subscription went well
// Except if you clear your storage
const subscribe = async (registration) => {
  // First get a public key from our Express server
  const response = await fetch('http://127.0.0.1:3000/api/webpush/vapid-public-key');
  const body = await response.json();
  const publicKey = body.publicKey;

  // this is an annoying part of the process we have to turn our public key
  // into a Uint8Array
  const Uint8ArrayPublicKey = urlBase64ToUint8Array(publicKey);

  // registering a new subscription to our service worker's Push manager
  const subscription = await registration.pushManager.subscribe({
    // don't worry about the userVisible only atm
    userVisibleOnly: true,
    applicationServerKey: Uint8ArrayPublicKey
  });

  // Sending the subscription object to our Express server
  await fetch('http://127.0.0.1:3000/api/webpush/sub?subId=test',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription.toJSON())
    }
  );
};

// Let's create an unsubscribe function as well
const unsubscribe = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  // This tells our browser that we want to unsubscribe
  await subscription.unsubscribe();

  // This tells our Express server that we want to unsubscribe
  await fetch('http://127.0.0.1:3000/api/webpush/unsub?subId=test', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription.toJSON())
  });
};

// I have found this code (or variations of) from; multiple sources
// but I could not find the original author
// here's one such source:
// https://stackoverflow.com/questions/42362235/web-pushnotification-unauthorizedregistration-or-gone-or-unauthorized-sub
const urlBase64ToUint8Array = (base64String) => {
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
};