import history from 'connect-history-api-fallback';
import type { Application } from 'express';
import serveIndex from 'serve-index';
import { errorHandler, notFoundHandler } from '../errors/error.middleware.ts';

type ExpressLib = typeof import('express');

/**
 * Register post-route middleware: static file serving, history API fallback,
 * 404 handler, and central error handler.
 * Call this after all application routes are registered.
 */
const postRoute = (app: Application, express: ExpressLib) => {
  const { UPLOAD_STATIC = null, WEB_STATIC = null } = globalThis.__config;

  if (UPLOAD_STATIC) {
    UPLOAD_STATIC.forEach(
      (item: { url: string; folder: string; list?: boolean; listOptions?: Record<string, unknown> }) => {
        const { url, folder, list, listOptions } = item;
        if (url && folder) {
          const authPlaceHolder = (_req: unknown, _res: unknown, next: () => void) => next(); // TODO add auth here...
          app.use(url, authPlaceHolder as Parameters<typeof app.use>[1], express.static(folder));
          if (list) app.use(url, serveIndex(folder, listOptions));
        }
      },
    );
  }

  if (WEB_STATIC?.length) {
    app.use(history());
    WEB_STATIC.forEach((item: { url: string; folder: string; options?: Record<string, unknown> }) => {
      app.use(item.url, express.static(item.folder, item.options));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);
};

export default postRoute;
