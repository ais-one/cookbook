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
// const { MODE } = import.meta.env

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    console.log('SW loading');

    const params = ''; // '?params=' + encodeURIComponent(JSON.stringify({ a: 1, b: Date.now() })) // TODO some problem with vite (development) if passing in params like this...
    const swPath = window.location.port === '3000' ? 'service-worker.js' : '/service-worker.js'; // if dev server use / in front... // NOTE: web path
    navigator.serviceWorker
      .register(swPath + params) // problem in dev no /vite
      .then(res => {
        window.SW_REG = res; // if you need this globally
        console.log('SW registered');
      })
      .catch(err => console.log('SW load Error', err));
  });
}
