// ─────────────────────────────────────────────────────────────────────────────
// AUTO-GENERATED — DO NOT EDIT
// Re-run `npm run generate:crud` to regenerate this file.
// Source table: tenants
// ─────────────────────────────────────────────────────────────────────────────
import { authUser } from '@common/node/auth/jwt';
import { validate } from '@common/node/errors/validate';
import express from 'express';
import {
  TenantsBodySchema,
  TenantsParamsSchema,
  TenantsQuerySchema,
  TenantsUpdateSchema,
} from '../../../schemas/generated/tenants.schema.js';
// Imports from the sidecar controller so developer overrides are picked up automatically.
import tenantsController from '../../controllers/tenants.ts';

export default express
  .Router()
  .post('/', authUser, validate('body', TenantsBodySchema), tenantsController.create)
  .get('/', authUser, validate('query', TenantsQuerySchema), tenantsController.find)
  .get('/:id', authUser, validate('params', TenantsParamsSchema), tenantsController.findOne)
  .patch(
    '/:id',
    authUser,
    validate('params', TenantsParamsSchema),
    validate('body', TenantsUpdateSchema),
    tenantsController.update,
  )
  .delete('/:id', authUser, validate('params', TenantsParamsSchema), tenantsController.remove);
