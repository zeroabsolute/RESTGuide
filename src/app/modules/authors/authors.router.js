import { Router } from 'express';
import Passport from 'passport';

import * as controller from './authors.controller';
import * as validator from './authors.validator';
import * as authorization from './authors.authorization';

const router = new Router();
const BASE_ROUTE = `/authors`;

router.route(BASE_ROUTE).post(
  Passport.authenticate('jwt', { session: false }),
  authorization.updateAuthorAuthorization,
  validator.createAuthorValidator,
  controller.createAuthor,
);

router.route(BASE_ROUTE).get(
  Passport.authenticate('jwt', { session: false }),
  validator.readAuthorsValidator,
  controller.readAuthors
);

router.route(`${BASE_ROUTE}/:id`).get(
  Passport.authenticate('jwt', { session: false }),
  controller.readOneAuthor
);

router.route(`${BASE_ROUTE}/:id`).patch(
  Passport.authenticate('jwt', { session: false }),
  authorization.updateAuthorAuthorization,
  validator.updateAuthorValidator,
  controller.updateAuthor
);

router.route(`${BASE_ROUTE}/:id`).delete(
  Passport.authenticate('jwt', { session: false }),
  authorization.updateAuthorAuthorization,
  controller.deleteAuthor
);

export default router;
