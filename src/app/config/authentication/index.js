import Passport from 'passport';

import Jwt from './jwt';
import BasicAuth from './basic';

export const jwtAuth = () => {
  Passport.use(Jwt);
};

export const basicAuth = BasicAuth;
