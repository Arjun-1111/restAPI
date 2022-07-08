/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import express from 'express';
import config from 'config';
import connectdb from './utils/connect';
import log from './utils/logger';
import router from './routes';

const port = config.get<number>('port') || 5000;
const app = express();
connectdb();

// middleware for router
app.use(router);

app.listen(port, () => log.info(`server running on port ${port}`));
