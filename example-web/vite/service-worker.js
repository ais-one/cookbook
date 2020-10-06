// self.importScripts('data/games.js') // import own data here

const CACHE_NAME_STATIC = 'example-app-vite-cache-static-v1.0.0'
const CACHE_NAME_DYNAMIC = 'example-app-vite-cache-dynamic-v1.0.0'

// requirements for add to homescreen
// - manifest
//   - name
//   - short_name
//   - start_url
//   - icons[n].sizes = '144x144', type = 'image/png'
// - https
// - service worker
// - visit app twice with at least 5 mins between visits

const cacheFilesStatic = [
  './',
  './index.html',
  './manifest.json'
  // '/css/style.css',
  // '/js/app.js',
  // '/images/recipe1.jpg',
  // '/images/recipe2.jpg',
  // '/images/recipe3.jpg',
  // '/images/recipe4.jpg',
  // '/images/recipe5.jpg',
  // '/images/recipe6.jpg',
]

// SW install and cache static assets
function addCaches(e) {
  const params = new URL(location).searchParams.get('params')
  console.log('SW addChaches', params)
  e.waitUntil(caches.open(CACHE_NAME_STATIC).then((cache) => cache.addAll(cacheFilesStatic)))
}
self.addEventListener('install', addCaches)

// SW activate and cache cleanup
function clearCaches(e) {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        if (cacheName !== CACHE_NAME_STATIC && cacheName !== CACHE_NAME_DYNAMIC) return caches.delete(cacheName)
      })
    })
  )
}
self.addEventListener('activate', clearCaches)

// CACHING STRATEGIES

// https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
// https://blog.bitsrc.io/5-service-worker-caching-strategies-for-your-next-pwa-app-58539f156f52
//
// Stale While Revalidate -  high-priority, high-critical files, non-GET requests - GOT ERRORS
// function staleWhileRevalidate(e) {
//   e.respondWith(
//     caches.open(CACHE_NAME_DYNAMIC)
//       .then(function (cache) {
//         cache.match(e.request)
//           .then(function (cacheResponse) {
//             fetch(e.request)
//               .then(function (networkResponse) {
//                 cache.put(e.request, networkResponse)
//               })
//             return cacheResponse || networkResponse
//           })
//       })
//   )
// }

//
// Cache with Network Update
// always one step behind
//
// Cache First - images, videos, CSS, etc.
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//       caches.open(cacheName)
//           .then(function(cache) {
//               cache.match(event.request)
//                   .then( function(cacheResponse) {
//                       if(cacheResponse)
//                           return cacheResponse
//                       else
//                           return fetch(event.request)
//                               .then(function(networkResponse) {
//                                   cache.put(event.request, networkResponse.clone())
//                                   return networkResponse
//                               })
//                   })
//           })
//   )
// });

// Cache then network - resources that update frequently (but get resources quickly to screen first)
function cacheThenNetwork(e) {
  e.respondWith(
    caches.open(CACHE_NAME_DYNAMIC).then(function (cache) {
      return fetch(e.request).then(function (res) {
        cache.put(e.request, res.clone())
        return res
      })
    })
    // arrow function version
    // .then(cache => fetch(e.request)
    //   .then(res => {
    //     cache.put(e.request, res.clone())
    //     return res
    //   })
    // )
  )
}

// async function networkFirst(request) {
//   const dynamicCache = await caches.open('news-dynamic');
//   try {
//     const networkResponse = await fetch(request);
//     dynamicCache.put(request, networkResponse.clone());
//     return networkResponse;
//   } catch (err) {
//     const cachedResponse = await dynamicCache.match(request);
//     return cachedResponse || await caches.match('../fallback.json');
//   }
// }
// Network first / Network fall back to cache - resources that update frequently
function networkCacheFallback(e) {
  e.respondWith(
    fetch(e.request).catch(function () {
      return caches.match(e.request)
    })
  )
}

// Cache first / Cache fall back to network
function cacheNetworkFallback(e) {
  e.respondWith(
    caches
      .match(e.request)
      .then(function (res) {
        return res || fetch(e.request)
        // .then(function(response) {
        //   if (response.status === 404) return caches.match('pages/404.html')
        //   return response
        // })
      })
      .catch(function () {
        // If both fail, show a generic fallback:
        return caches.match('/offline.html')
        // However, in reality you'd have many different
        // fallbacks, depending on URL & headers.
        // Eg, a fallback silhouette image for avatars.
      })
  )
}

// Cache only - e.g. logo image
function cacheOnly(e) {
  e.respondWith(
    // caches.match(e.request) // ALL
    caches.open(CACHE_NAME_STATIC).then(function (cache) {
      return cache.match(e.request)
    }) // .then(res => res) // named cache
  )
}

// Network only
function networkOnly(e) {
  e.respondWith(fetch(e.request))
}

// WebPush
self.addEventListener('push', function (e) {
  let message = 'Push message no payload'
  if (e.data) {
    message = e.data.text()
  }

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
  }
  e.waitUntil(
    // We use the service worker's registration `showNotification` function to display the Notification
    self.registration.showNotification('💊💊 You got notified! 💊💊', notificationOptions)
  )
})

// self.addEventListener('notificationclick', (event) => {
//   console.log('our user clicked on the notification!')
//   // Send user data analytics 🔥 🔥 🔥
// }, false);

// pushsubscriptionchange event
async function handlePush(e) {
  // Exit early if we don't have access to the client.
  // Eg, if it's cross-origin.
  if (!e.clientId) return

  // Get the client.
  const client = await clients.get(e.clientId)
  // Exit early if we don't get the client.
  // Eg, if it closed.
  if (!client) return

  // Send a message to the client.
  client.postMessage({ msg: 'pushsubscriptionchange', sub: e.newSubscription })
}
self.addEventListener('pushsubscriptionchange', (e) => e.waitUntil(handlePush(e)))

// self.addEventListener('fetch', (event) => event.waitUntil(handlePush(event)))
