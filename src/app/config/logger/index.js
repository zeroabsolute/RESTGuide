import Bunyan from 'bunyan';
import Path from 'path';

import config from '../var';

let logger = null;

/**
 * Express logger config.
 */

export const expressLoggerConfig = {
  name: config.appName,
  streams: [
    {
      level: 'info',
      path: Path.resolve(__dirname, `../../../../logs/${config.appName}-logs-info.log`),
      period: '3d',
      count: 3,
    }
  ],
};

/**
 * Generates a Bunyan logger service.
 * Will be called during server initialization.
 */

export const initLoggerService = () => {
  logger = Bunyan.createLogger({
    name: config.appName,
    streams: [
      {
        level: 'debug',
        stream: process.stdout,
      }, {
        level: 'info',
        path: Path.resolve(__dirname, `../../../../logs/${config.appName}-logs-info.log`),
      }, {
        level: 'warn',
        path: Path.resolve(__dirname, `../../../../logs/${config.appName}-logs-warn.log`),
      }, {
        level: 'error',
        path: Path.resolve(__dirname, `../../../../logs/${config.appName}-logs-error.log`),
      }, {
        level: 'fatal',
        path: Path.resolve(__dirname, `../../../../logs/${config.appName}-logs-fatal.log`),
      }
    ],
  }); 
};

export const getLogger = () => logger;
