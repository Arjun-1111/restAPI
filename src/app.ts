/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import express from 'express';
import config from 'config';
import xssClean from 'xss-clean';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import helmet from 'helmet';
import connectdb from './utils/connect';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import limiter from '../rateLimiter';
import log from './utils/logger';
import router from './routes';
import xssCleanType from '../xss-clean.t';
import { deserializeUser } from './middleware/deserializeUser';

const port = config.get<number>('port') || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectdb();
app.use(morgan('tiny'));
// By default, $ and . characters are removed completely from user-supplied input in the following places:
// - req.body
// - req.params
// - req.headers
// - req.query
// To remove data using these defaults:
app.use(mongoSanitize());
// to sanitize user input coming from POST body, GET queries, and url params.
app.use(xssClean());
// Basic rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints such as password reset
app.use(limiter);
// Express middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp());
// Helmet.js is a Node.js module that helps in securing HTTP headers
app.use(helmet());

// middle for deserialize user
app.use(deserializeUser);

// middleware for routers
app.use(router);

app.listen(port, () => log.info(`server running on port ${port}`));
