import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,

  integrations: [
    Sentry.browserTracingIntegration(), // performance monitoring
    Sentry.replayIntegration(), // session replay on errors
  ],

  // Performance
  tracesSampleRate: 1.0, // lower to 0.2 in prod once stable

  // Session Replay — only fires when an error occurs
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Capture 422s and other HTTP errors
  beforeSend(event) {
    return event;
  },
});
