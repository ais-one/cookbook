// src/health/health.router.js
import { Router } from 'express';
import { liveness, readiness } from './controller.ts';

export const healthRouter = Router({ caseSensitive: true });

/**
 * GET /health
 * @summary Healthcheck endpoint
 * @tags health
 * @return {object} 200 - success response - application/json
 */
healthRouter.get('/', liveness); // GET /health

/**
 * GET /health/ready
 * @summary Healthcheck endpoint
 * @tags health
 * @return {object} 200 - success response - application/json
 */
healthRouter.get('/ready', readiness); // GET /health/ready
