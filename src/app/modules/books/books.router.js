import { Router } from 'express';
import passport from 'passport';

import * as controller from './books.controller';
import * as validator from './books.validator';
import * as authorization from './books.authorization';

const router = new Router();
const BASE_ROUTE = `/books`;

router.route(BASE_ROUTE).post(
  passport.authenticate('jwt', { session: false }),
  authorization.updateBookAuthorization,
  validator.createBookValidator,
  controller.createBook,
);

router.route(BASE_ROUTE).get(
  passport.authenticate('jwt', { session: false }),
  validator.readBooksValidator,
  controller.readBooks
);

router.route(`${BASE_ROUTE}/:id`).get(
  passport.authenticate('jwt', { session: false }),
  controller.readOneBook
);

router.route(`${BASE_ROUTE}/:id`).patch(
  passport.authenticate('jwt', { session: false }),
  authorization.updateBookAuthorization,
  validator.updateBookValidator,
  controller.updateBook
);

router.route(`${BASE_ROUTE}/:id`).delete(
  passport.authenticate('jwt', { session: false }),
  authorization.updateBookAuthorization,
  controller.deleteBook
);

export default router;
