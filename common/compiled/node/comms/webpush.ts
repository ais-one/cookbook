import webPush from 'web-push';

// npx web-push generate-vapid-keys
const vapidKeys = webPush.generateVAPIDKeys();
const { publicKey, privateKey } = vapidKeys;
const { WEBPUSH_VAPID_SUBJ } = process.env;

if (WEBPUSH_VAPID_SUBJ) {
  webPush.setVapidDetails(WEBPUSH_VAPID_SUBJ, publicKey, privateKey);
}

/**
 * Send a Web Push notification to a subscriber.
 * Throws if the push service returns an error (e.g. 410 Gone for expired subscriptions).
 *
 * @param subscription - PushSubscription object saved from the browser's `pushManager.subscribe()`.
 * @param payload - Notification payload (string, Buffer, or null for keyless subscriptions).
 * @param options - Optional web-push request options (e.g. `{ TTL: 60 }`).
 */
const send = async (
  subscription: webPush.PushSubscription,
  payload: string | Buffer | null,
  options: webPush.RequestOptions = { TTL: 60 },
): Promise<webPush.SendResult> => {
  if (!subscription.keys) {
    payload = payload || null;
  }
  return webPush.sendNotification(subscription, payload ?? undefined, options);
};

/** Returns the VAPID public key to share with browser clients. */
const getPubKey = (): string => vapidKeys.publicKey;

export { getPubKey, send };

// // sw.js
// self.addEventListener('push', (event) => {
//   const data = event.data.json();
//   self.registration.showNotification(data.title, {
//     body: data.body,
//     icon: '/icon.png',
//   });
// });

// // pn.js
// const reg = await navigator.serviceWorker.register('/sw.ts');

// const subscription = await reg.pushManager.subscribe({
//   userVisibleOnly: true,
//   applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY), // your public VAPID key
// });

// // Save subscription to your server
// await fetch('/api/subscribe', {
//   method: 'POST',
//   body: JSON.stringify(subscription),
//   headers: { 'Content-Type': 'application/json' },
// });
