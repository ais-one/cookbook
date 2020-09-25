const cacheName = 'example-app-vite-cache-v1.0.0';

const cacheFiles = [
  './',
  './index.html',
  './manifest.json',
  // "/css/style.css",
  // "/js/app.js",
  // "/images/recipe1.jpg",
  // "/images/recipe2.jpg",
  // "/images/recipe3.jpg",
  // "/images/recipe4.jpg",
  // "/images/recipe5.jpg",
  // "/images/recipe6.jpg",
]

// Cache all the files to make a PWA
// self.addEventListener('install', e => {
//   e.waitUntil(
//     caches.open(cacheName).then(cache => {
//       // Our application only has two files here index.html and manifest.json
//       // but you can add more such as style.css as your app grows
//       return cache.addAll(cacheFiles);
//     })
//   );
// });

// Our service worker will intercept all fetch requests
// and check if we have cached the file
// if so it will serve the cached file
// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.open(cacheName)
//       .then(cache => cache.match(event.request, { ignoreSearch: true }))
//       .then(response => {
//         return response || fetch(event.request);
//       })
//   )
//   // event.respondWith(
//   //   caches.match(event.request).then(res => {
//   //     return res || fetch(event.request);
//   //   })
//   // )
// });

// WebPush
self.addEventListener('push', function (e) {
  const message = e.data;

  // The notificationOptions will shape the look and behavior of our notification
  const notificationOptions = {
    body: `Time is the message: ${message}`,
    // we use the images from the PWA generator we made
    icon: '/images/icons/icon-512x512.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  e.waitUntil(
    // We use the service worker's registration `showNotification` function to display the Notification
    self.registration.showNotification('💊💊 You got notified! 💊💊', notificationOptions)
  );
});

// self.addEventListener('notificationclick', (event) => {
//   console.log('our user clicked on the notification!')
//   // Send user data analytics 🔥 🔥 🔥
// }, false);