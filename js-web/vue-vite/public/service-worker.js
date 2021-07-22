// self.importScripts('data/games.js') // import own data here

const CACHE_NAME_STATIC = 'vue-vite-cache-static-v1.0.0'
const CACHE_NAME_DYNAMIC = 'vue-vite-cache-dynamic-v1.0.0'

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
  'index.html',
  'manifest.json'
  // 'css/style.css',
  // 'js/app.js',
  // 'images/recipe1.jpg',
]

// SW install and cache static assets
function addCaches(e) {
  // if (e.origin !== "http://example.org") return // check and reject if not correct origin
  console.log('SW location', location)
  try {
    const params = new URL(location).searchParams.get('params')
    console.log('SW addCaches params', typeof params, params)
  } catch (err) {
    console.log('SW addCaches error', err.toString())
  }
  e.waitUntil(caches.open(CACHE_NAME_STATIC).then((cache) => cache.addAll(cacheFilesStatic)).catch((err) => console.log('SW addCaches Error', err)))
}
self.addEventListener('install', addCaches)

// SW activate and cache cleanup
function clearCaches(e) {
  // if (e.origin !== "http://example.org") return // check and reject if not correct origin
  console.log('SW clearCaches')
  e.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // return Promise.all(
        //   cacheNames.filter((cacheName) =>
        //     !(cacheName === CACHE_NAME_STATIC || cacheName === CACHE_NAME_DYNAMIC)
        //   ).map((cacheName) => {
        //     return caches.delete(cacheName)
        //   })
        // )
        cacheNames.forEach((cacheName) => {
          if (!(cacheName === CACHE_NAME_STATIC || cacheName === CACHE_NAME_DYNAMIC)) {
            console.log('sw delete cache = ', cacheName)
            return caches.delete(cacheName)
          }
        })
      })
      .catch((err) => console.log('SW clearCaches Error', err))
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
        //   if (response.status === 404) return caches.match('views/404.html')
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
  // if (e.origin !== "http://example.org") return // check and reject if not correct origin
  let message = 'Push message no payload'
  if (e.data) {
    message = e.data.text()
  }

  // The notificationOptions will shape the look and behavior of our notification
  const notificationOptions = {
    body: `Time is the message: ${message}`,
    // we use the images from the PWA generator we made
    // icon: '/img/icons/icon-512x512.png',
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
self.addEventListener('pushsubscriptionchange', (e) => {
  // if (e.origin !== "http://example.org") return // check and reject if not correct origin
  return e.waitUntil(handlePush(e))
})

// self.addEventListener('fetch', (e) => e.waitUntil(handlePush(event)))

// https://www.udemy.com/course/progressive-web-apps

// Static cache strategy - Cache with Network Fallback
// const staticCache = (req, cacheName = CACHE_NAME_STATIC) => {
//   return caches.match(req).then((cachedRes) => {
//     // return cache response if found
//     if (cachedRes) return cachedRes

//     // Fallback to network
//     return fetch(req).then((networkRes) => {
//       // update cache with new response
//       caches.open(cacheName).then((cache) => cache.put(req, networkRes))

//       // return clone of network response
//       return networkRes.clone()
//     })
//   })
// }

// // Network with Cache Fallback
// const fallbackCache = (req) => {
//   return (
//     fetch(req)
//       .then((networkRes) => {
//         // check is res ok else go cache
//         if (!networkRes.ok) throw new Error('Fetch Error')

//         // Update cache
//         caches.open(CACHE_NAME_STATIC).then((cache) => cache.put(req, networkRes))

//         return networkRes.clone()
//       })
//       // try cache
//       .catch((err) => {
//         console.log(err)
//         return caches.match(req)
//       })
//   )
// }

// // Clean
// const cleanGiphyCache = (giphys) => {
//   caches.open('giphy.com/media').then((cache) => {
//     // Get all cache entries
//     cache.keys().then((keys) => {
//       // loop entries
//       keys.forEach((key) => {
//         // if entry NOT part of current giphys, Delete
//         if (!giphys.includes(key.url)) cache.delete(key)
//       })
//     })
//   })
// }

// // SW Fetch
// self.addEventListener('fetch', (e) => {
//   if (e.request.url.match(location.origin)) {
//     e.respondWith(staticCache(e.request))
//   } else if (e.request.url.match('api.giphy.com/v1/gifs/trending')) {
//     e.respondWith(fallbackCache(e.request))
//   } else if (e.request.url.match('giphy.com/media')) {
//     e.respondWith(staticCache(e.request, 'giphy-media-cache'))
//   }
// })

// // listen to message from client
// self.addEventListener('message', (e) => {
//   if (e.data.action === 'cleanGiphyCache') cleanGiphyCache(e.data.giphys)
// })

// // on pwa-init.js
// // also run this when you are registering service worker?
// async function giphyCacheClean(giphys) {
//   const reg = await navigator.serviceWorker.getRegistration()
//   if (reg.active) {
//     reg.active.postMessage({
//       action: 'cleanGiphyCache',
//       giphys
//     })
//   }
// }
