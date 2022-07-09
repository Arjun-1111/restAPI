/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-duplicates */

import express from 'express';
import { createUserHandler } from '../src/controller/user.controller';
import validateResource from './middleware/validateResource';
import { userSchema } from './schema/user.schema';

const router = express.Router();

router.post('/api/users', validateResource(userSchema), createUserHandler);

export default router;
