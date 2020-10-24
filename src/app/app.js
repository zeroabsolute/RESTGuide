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
import errorHandler from './helpers/error_middleware';

const app = Express();

jwtAuth();
initLoggerService();

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

export default app;