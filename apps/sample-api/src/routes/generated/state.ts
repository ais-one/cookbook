// ─────────────────────────────────────────────────────────────────────────────
// AUTO-GENERATED — DO NOT EDIT
// Re-run `npm run generate:crud` to regenerate this file.
// Source table: state
// ─────────────────────────────────────────────────────────────────────────────
import { authUser } from '@common/node/auth/jwt';
import { validate } from '@common/node/errors/validate';
import express from 'express';
import {
  StateBodySchema,
  StateParamsSchema,
  StateQuerySchema,
  StateUpdateSchema,
} from '../../../schemas/generated/state.schema.js';
// Imports from the sidecar controller so developer overrides are picked up automatically.
import stateController from '../../controllers/state.ts';

export default express
  .Router()
  .post('/', authUser, validate('body', StateBodySchema), stateController.create)
  .get('/', authUser, validate('query', StateQuerySchema), stateController.find)
  .get('/:id', authUser, validate('params', StateParamsSchema), stateController.findOne)
  .patch(
    '/:id',
    authUser,
    validate('params', StateParamsSchema),
    validate('body', StateUpdateSchema),
    stateController.update,
  )
  .delete('/:id', authUser, validate('params', StateParamsSchema), stateController.remove);
