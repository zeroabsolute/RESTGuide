import { Router } from 'express';
import Passport from 'passport';
import Multer from 'multer';

import * as controller from './books.controller';
import * as validator from './books.validator';
import * as authorization from './books.authorization';
import { multerConfigForMemoryStorage } from '../../config/file_upload';

const router = new Router();
const BASE_ROUTE = `/books`;

router.route(BASE_ROUTE).post(
  Passport.authenticate('jwt', { session: false }),
  authorization.updateBookAuthorization,
  validator.createBookValidator,
  controller.createBook,
);

router.route(BASE_ROUTE).get(
  Passport.authenticate('jwt', { session: false }),
  validator.readBooksValidator,
  controller.readBooks
);

router.route(`${BASE_ROUTE}/:id`).get(
  Passport.authenticate('jwt', { session: false }),
  controller.readOneBook
);

router.route(`${BASE_ROUTE}/:id`).patch(
  Passport.authenticate('jwt', { session: false }),
  authorization.updateBookAuthorization,
  validator.updateBookValidator,
  controller.updateBook
);

router.route(`${BASE_ROUTE}/:id`).delete(
  Passport.authenticate('jwt', { session: false }),
  authorization.updateBookAuthorization,
  controller.deleteBook
);

router.route(`${BASE_ROUTE}/:id/images/bulk`).post(
  Passport.authenticate('jwt', { session: false }),
  authorization.updateBookAuthorization,
  Multer(multerConfigForMemoryStorage).array('images', 10),
  controller.uploadImages
);

router.route(`${BASE_ROUTE}/:bookId/images/:imageId`).delete(
  Passport.authenticate('jwt', { session: false }),
  authorization.updateBookAuthorization,
  controller.deleteImage
);

export default router;
