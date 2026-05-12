// ─────────────────────────────────────────────────────────────────────────────
// AUTO-GENERATED — DO NOT EDIT
// Re-run `npm run generate:crud` to regenerate this file.
// Source table: categories
// ─────────────────────────────────────────────────────────────────────────────
import { authUser } from '@common/node/auth/jwt';
import { validate } from '@common/node/errors/validate';
import express from 'express';
import {
  CategoriesBodySchema,
  CategoriesParamsSchema,
  CategoriesQuerySchema,
  CategoriesUpdateSchema,
} from '../../../schemas/generated/categories.schema.js';
// Imports from the sidecar controller so developer overrides are picked up automatically.
import categoriesController from '../../controllers/categories.ts';

export default express
  .Router()
  .post('/', authUser, validate('body', CategoriesBodySchema), categoriesController.create)
  .get('/', authUser, validate('query', CategoriesQuerySchema), categoriesController.find)
  .get('/:id', authUser, validate('params', CategoriesParamsSchema), categoriesController.findOne)
  .patch(
    '/:id',
    authUser,
    validate('params', CategoriesParamsSchema),
    validate('body', CategoriesUpdateSchema),
    categoriesController.update,
  )
  .delete('/:id', authUser, validate('params', CategoriesParamsSchema), categoriesController.remove);
