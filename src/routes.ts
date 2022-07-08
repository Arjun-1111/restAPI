/* eslint-disable import/no-duplicates */
import { Request, Response } from 'express';
import express from 'express';

const router = express.Router();

router.route('/hello').get((req: Request, res: Response) => {
  res.status(200).json({
    data: 'success',
  });
});

export default router;
