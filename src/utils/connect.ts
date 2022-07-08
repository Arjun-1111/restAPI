/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import mongoose from 'mongoose';
import config from 'config';
import log from './logger';

const connectdb = () =>
  mongoose
    .connect(config.get<string>('dbUri'))
    .then(() => log.info('Connected to the database'))
    .catch((err) => {
      log.error(err);
      process.exit(1);
    });

export default connectdb;
