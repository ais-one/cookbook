import * as Sentry from '@sentry/vue'; // Sentry

// sentry
// Sentry.captureMessage('Something went wrong Vue Vute' + Date.now())
export default function createSentry(app, router) {
  const { VITE_SENTRY_DSN } = import.meta.env;
  if (VITE_SENTRY_DSN) {
    Sentry.init({
      app,
      dsn: VITE_SENTRY_DSN,
      integrations: [Sentry.browserTracingIntegration({ router })],
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],

      // Capture Replay for 10% of all sessions,
      // plus for 100% of sessions with an error
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
}
