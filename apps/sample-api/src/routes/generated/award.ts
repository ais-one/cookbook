// ─────────────────────────────────────────────────────────────────────────────
// AUTO-GENERATED — DO NOT EDIT
// Re-run `npm run generate:crud` to regenerate this file.
// Source table: award
// ─────────────────────────────────────────────────────────────────────────────
import { authUser } from '@common/node/auth/jwt';
import { validate } from '@common/node/errors/validate';
import express from 'express';
import {
  AwardBodySchema,
  AwardParamsSchema,
  AwardQuerySchema,
  AwardUpdateSchema,
} from '../../../schemas/generated/award.schema.js';
// Imports from the sidecar controller so developer overrides are picked up automatically.
import awardController from '../../controllers/award.ts';

export default express
  .Router()
  .post('/', authUser, validate('body', AwardBodySchema), awardController.create)
  .get('/', authUser, validate('query', AwardQuerySchema), awardController.find)
  .get('/:code', authUser, validate('params', AwardParamsSchema), awardController.findOne)
  .patch(
    '/:code',
    authUser,
    validate('params', AwardParamsSchema),
    validate('body', AwardUpdateSchema),
    awardController.update,
  )
  .delete('/:code', authUser, validate('params', AwardParamsSchema), awardController.remove);
