import Express from 'express';
import BodyParser from 'body-parser';
import Cors from 'cors';
import SwaggerUI from 'swagger-ui-express';
import Passport from 'passport';
import ExpressBunyanLogger from 'express-bunyan-logger';

import routes from './routes';
import config from './config/var';
import { jwtAuth, basicAuth } from './config/authentication';
import { initLoggerService, expressLoggerConfig } from './config/logger';
import fileService from './config/file_upload';
import errorHandler from './utils/error_middleware';
import buckets from './constants/buckets';

const app = Express();

// Service initializations
jwtAuth();
initLoggerService();

fileService.initFileUploadService();
setTimeout(() => {
  fileService.createBucket(buckets.DEFAULT);
}, 500);

// Express app config
app.use(BodyParser.json({ limit: '10mb' }));
app.use(BodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(Cors());
app.use(Passport.initialize());
app.use(ExpressBunyanLogger(expressLoggerConfig));
app.use("/api/v1", routes);

const swaggerDocument = require('../docs/openapi.json');

app.use(
  '/api/swagger',
  basicAuth(config.apiDocsUsername, config.apiDocsPassword, true),
  SwaggerUI.serve,
  SwaggerUI.setup(swaggerDocument, false, { docExpansion: 'none' })
);
app.use(errorHandler);

// Catch all unhandled errors and log them
process.on('unhandledRejection', (reason) => {
  throw reason;
});

process.on('uncaughtException', (error) => {
  errorHandler(error);
});

export default app;