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

const router = express.Router();

router.post('/api/users', validateResource(userSchema), createUserHandler);

router
  .route('/api/sessions')
  .post(validateResource(createSessionSchema), createUserSessionHandler)
  .get(requireUser, getUserSessionHandler)
  .delete(requireUser, deleteSessionHandler);

export default router;
