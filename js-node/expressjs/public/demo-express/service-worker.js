// self.importScripts('data/games.js') // import own data here

const CACHE_NAME_STATIC = 'demo-express-cache-static-v1.0.0'
const CACHE_NAME_DYNAMIC = 'demo-express-cache-dynamic-v1.0.0'

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

// Cache then network - resources that update frequently (but get resources quickly to screen first)
function cacheThenNetwork(e) {
  e.respondWith(
    caches.open(CACHE_NAME_DYNAMIC).then(function (cache) {
      return fetch(e.request).then(function (res) {
        cache.put(e.request, res.clone())
        return res
      })
    })
  )
}

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
