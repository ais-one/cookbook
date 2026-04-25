// Frontend logging
// for production, send to Sentry
// Usage:
// import './logger.js';
// globalThis.logger = logger; // One line! globalThis for browser and node runtimes

// logger.js (works on both frontend and backend)
class Logger {
  constructor() {
    // Works in both environments
    this.isDev = typeof process !== 'undefined' ? process.env.NODE_ENV === 'development' : import.meta.env.DEV;
  }

  log(message, data) {
    if (this.isDev) {
      // console.log(`[LOG] ${message}`, data);
    }
  }

  warn(message, data) {
    if (this.isDev) {
      // console.warn(`[WARN] ${message}`, data);
    }
  }

  error(message, data) {
    if (this.isDev) {
      // console.error(`[ERROR] ${message}`, data);
    } else {
      this.reportError(message, data);
    }
  }

  reportError(message, data) {
    // Send to monitoring service
    if (typeof fetch !== 'undefined') {
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, data, timestamp: new Date() }),
      }).catch(() => {});
    }
  }
}

export const logger = new Logger();
globalThis.logger = logger;
