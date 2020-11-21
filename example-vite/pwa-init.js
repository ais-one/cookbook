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
// const { VITE_PWA_PN } = import.meta.env // No longer needed
// console.log('VITE_PWA_PN', VITE_PWA_PN)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async function () {
    navigator.serviceWorker
      // .register('/service-worker.js?params=' + encodeURIComponent(JSON.stringify({ a: 1, b: Date.now() })))
      .register('service-worker.js') // TBD some problem with vite (development) if passing in params like this...
      .then((res) => console.log('service worker registered'))
      .catch((err) => console.log(err))
  })
}
