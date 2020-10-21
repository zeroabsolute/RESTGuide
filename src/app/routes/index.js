import { Router } from 'express';
import Path from 'path';
import { readdirSync, lstatSync } from 'fs';

import healthRouter from './health';

const router = new Router();

router.use(healthRouter);

/**
 * Read all routers from the '/modules' directory.
 */

const modulesDirContent = readdirSync(Path.join(__dirname, '../modules'));

modulesDirContent.forEach((item) => {
  const currentItemPath = Path.join(__dirname, `../modules/${item}`);
  const isDirectory = lstatSync(currentItemPath).isDirectory();

  if (isDirectory) {
    const routerFilePath = Path.join(__dirname, `../modules/${item}/${item}.router.js`);
    const module = require(routerFilePath);

    if (module && module.default) {
      router.use(module.default);
    }
  }
});

export default router;