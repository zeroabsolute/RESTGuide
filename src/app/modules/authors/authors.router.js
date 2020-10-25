import { Router } from 'express';
import passport from 'passport';

import * as controller from './authors.controller';
import * as validator from './authors.validator';
import * as authorization from './authors.authorization';

const router = new Router();
const BASE_ROUTE = `/authors`;

router.route(BASE_ROUTE).post(
  passport.authenticate('jwt', { session: false }),
  authorization.updateAuthorAuthorization,
  validator.createAuthorValidator,
  controller.createAuthor,
);

router.route(BASE_ROUTE).get(
  passport.authenticate('jwt', { session: false }),
  validator.readAuthorsValidator,
  controller.readAuthors
);

router.route(`${BASE_ROUTE}/:id`).get(
  passport.authenticate('jwt', { session: false }),
  controller.readOneAuthor
);

router.route(`${BASE_ROUTE}/:id`).patch(
  passport.authenticate('jwt', { session: false }),
  authorization.updateAuthorAuthorization,
  validator.updateAuthorValidator,
  controller.updateAuthor
);

router.route(`${BASE_ROUTE}/:id`).delete(
  passport.authenticate('jwt', { session: false }),
  authorization.updateAuthorAuthorization,
  controller.deleteAuthor
);

export default router;
