import Express from 'express';
import Cors from 'cors';
import SwaggerUI from 'swagger-ui-express';
import SwaggerJsdoc from 'swagger-jsdoc';
import Path from 'path';
import YAML from 'yamljs';
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
app.use(Express.json({ limit: '10mb' }));
app.use(Express.urlencoded({ limit: '10mb', extended: false }));
app.use(Cors());
app.use(Passport.initialize());
app.use(ExpressBunyanLogger(expressLoggerConfig));
app.use("/api/v1", routes);

// Setup docs
const docsFilePath = Path.resolve(__dirname, '../docs/openapi.yaml');
const jsonDocsFile = YAML.load(docsFilePath);
const docs = SwaggerJsdoc({
  swaggerDefinition: jsonDocsFile,
  apis: ['./modules/**/*.js'],
});

app.use(
  '/api/swagger',
  basicAuth(config.apiDocsUsername, config.apiDocsPassword, true),
  SwaggerUI.serve,
  SwaggerUI.setup(docs, false, { docExpansion: 'none' }),
);

// Error handling
app.use(errorHandler);

// Catch all unhandled errors and log them
process.on('unhandledRejection', (reason) => {
  throw reason;
});

process.on('uncaughtException', (error) => {
  errorHandler(error);
});

export default app;