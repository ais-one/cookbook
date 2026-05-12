#!/usr/bin/env node
// scripts/generate-openapi.ts
//
// Generates docs/openapi/openapi.merged.yaml from Zod v4 schemas at common/schemas/*.schema.js.
// Uses zod-openapi — no monkey-patching, no separate registry object.
//
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { createDocument } from 'zod-openapi';

// Importing schemas makes them available to createDocument via .meta({ id })
import {
  ErrorResponseSchema,
  LoginBodySchema,
  MessageResponseSchema,
  RegisterBodySchema,
  TokenResponseSchema,
} from '../common/schemas/auth.schema.js';

// Import error schema explicitly so it is included as a reusable component
import '../common/schemas/error.schema.js';

import {
  NotificationParamsSchema,
  NotificationSchema,
  SendNotificationBodySchema,
} from '../common/schemas/notification.schema.js';
import { CreatePaymentBodySchema, PaymentParamsSchema, PaymentSchema } from '../common/schemas/payment.schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── Reusable error response content block ──────────────────────────────────
const errorContent = {
  'application/json': { schema: ErrorResponseSchema },
};

// ── Full OpenAPI document ──────────────────────────────────────────────────
const document = createDocument({
  openapi: '3.1.0',
  info: {
    title: 'Microservices — Merged API',
    description: 'Auto-generated from Zod v4 schemas via zod-openapi. Do not edit manually.',
    version: '1.0.0',
    contact: { name: 'API Support', email: 'support@example.com' },
  },
  servers: [
    { url: 'http://localhost:8080', description: 'Local (via API Gateway)' },
    { url: 'https://api.example.com', description: 'Production' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT issued by POST /api/v1/auth/login',
      },
    },
  },
  paths: {
    // ── Auth ───────────────────────────────────────────────────────────────
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: RegisterBodySchema } },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: { 'application/json': { schema: MessageResponseSchema } },
          },
          422: { description: 'Validation error', content: errorContent },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate and receive a JWT',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: LoginBodySchema } },
        },
        responses: {
          200: {
            description: 'Authentication successful',
            content: { 'application/json': { schema: TokenResponseSchema } },
          },
          401: { description: 'Invalid credentials', content: errorContent },
          422: { description: 'Validation error', content: errorContent },
        },
      },
    },

    // ── Payments ───────────────────────────────────────────────────────────
    '/api/v1/payments': {
      post: {
        tags: ['Payments'],
        summary: 'Create a new payment',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: CreatePaymentBodySchema } },
        },
        responses: {
          201: {
            description: 'Payment created',
            content: { 'application/json': { schema: PaymentSchema } },
          },
          401: { description: 'Unauthorized', content: errorContent },
          422: { description: 'Validation error', content: errorContent },
        },
      },
      get: {
        tags: ['Payments'],
        summary: 'List all payments',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Array of payments',
            content: { 'application/json': { schema: { type: 'array', items: PaymentSchema } } },
          },
          401: { description: 'Unauthorized', content: errorContent },
        },
      },
    },
    '/api/v1/payments/{id}': {
      get: {
        tags: ['Payments'],
        summary: 'Get a payment by ID',
        security: [{ bearerAuth: [] }],
        requestParams: { path: PaymentParamsSchema },
        responses: {
          200: {
            description: 'Payment found',
            content: { 'application/json': { schema: PaymentSchema } },
          },
          401: { description: 'Unauthorized', content: errorContent },
          404: { description: 'Not found', content: errorContent },
        },
      },
    },

    // ── Notifications ──────────────────────────────────────────────────────
    '/api/v1/notifications': {
      post: {
        tags: ['Notifications'],
        summary: 'Send a notification',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: SendNotificationBodySchema } },
        },
        responses: {
          201: {
            description: 'Notification sent',
            content: { 'application/json': { schema: NotificationSchema } },
          },
          401: { description: 'Unauthorized', content: errorContent },
          422: { description: 'Validation error', content: errorContent },
        },
      },
      get: {
        tags: ['Notifications'],
        summary: 'List all notifications',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Array of notifications',
            content: { 'application/json': { schema: { type: 'array', items: NotificationSchema } } },
          },
          401: { description: 'Unauthorized', content: errorContent },
        },
      },
    },
    '/api/v1/notifications/{id}': {
      get: {
        tags: ['Notifications'],
        summary: 'Get a notification by ID',
        security: [{ bearerAuth: [] }],
        requestParams: { path: NotificationParamsSchema },
        responses: {
          200: {
            description: 'Notification found',
            content: { 'application/json': { schema: NotificationSchema } },
          },
          401: { description: 'Unauthorized', content: errorContent },
          404: { description: 'Not found', content: errorContent },
        },
      },
    },
  },
});

// ── Write output ───────────────────────────────────────────────────────────
const outPath = resolve(ROOT, 'docs', 'openapi', 'openapi.merged.yaml');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, yaml.dump(document, { lineWidth: 120 }));

console.log(`\n✅ OpenAPI spec written to ${relative(ROOT, outPath)}`);
console.log(`   Paths:   ${Object.keys(document.paths ?? {}).length}`);
console.log(`   Schemas: ${Object.keys(document.components?.schemas ?? {}).length}\n`);
