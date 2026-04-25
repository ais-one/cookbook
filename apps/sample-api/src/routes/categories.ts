import { authUser } from '@common/node/auth/jwt';
import { validate } from '@common/node/errors/validate';
import express from 'express';
import {
  CategoryBodySchema,
  CategoryParamsSchema,
  CategoryQuerySchema,
  CategoryUpdateSchema,
} from '../../schemas/categories.schema.js';
import categoryController from '../controllers/category.ts';

export default express
  .Router()
  .post('/categories', authUser, validate('body', CategoryBodySchema), categoryController.create)
  .patch(
    '/categories/:id',
    authUser,
    validate('params', CategoryParamsSchema),
    validate('body', CategoryUpdateSchema),
    categoryController.update,
  )
  .get('/categories/:id', authUser, validate('params', CategoryParamsSchema), categoryController.findOne)
  .get('/categories', authUser, validate('query', CategoryQuerySchema), categoryController.find)
  .delete('/categories/:id', authUser, validate('params', CategoryParamsSchema), categoryController.remove);
// .delete('/:id', authUser, categoryController.remove)
