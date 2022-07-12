/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-duplicates */

import express from 'express';
import { createUserHandler } from '../src/controller/user.controller';
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionHandler,
} from './controller/session.controller';
import validateResource from './middleware/validateResource';
import { userSchema } from './schema/user.schema';
import { createSessionSchema } from './schema/session.schema';
import requireUser from './middleware/requireUser';
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from './schema/product.schema';
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from './controller/product.controller';

const router = express.Router();

router.post('/api/users', validateResource(userSchema), createUserHandler);

router
  .route('/api/sessions')
  .post(validateResource(createSessionSchema), createUserSessionHandler)
  .get(requireUser, getUserSessionHandler)
  .delete(requireUser, deleteSessionHandler);

router.post(
  '/api/products',
  [requireUser, validateResource(createProductSchema)],
  createProductHandler
);

router
  .route('/api/products/:productId')
  .get(requireUser, validateResource(getProductSchema), getProductHandler)
  .put(
    [requireUser, validateResource(updateProductSchema)],
    updateProductHandler
  )
  .delete(
    [requireUser, validateResource(deleteProductSchema)],
    deleteProductHandler
  );

export default router;
