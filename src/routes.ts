/* eslint-disable import/no-duplicates */

import express from 'express';
import { createUserHandler } from '../src/controller/user.controller';

const router = express.Router();

router.post('/api/users', createUserHandler);

export default router;
