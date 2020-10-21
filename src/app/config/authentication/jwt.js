import { Strategy, ExtractJwt } from 'passport-jwt';
import Jwt from 'jsonwebtoken';

import config from '../../config/var';

const opts = {
  secretOrKey: config.jwtSecretKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export const createToken = (user) => {
  return Jwt.sign({
    _id: user._id,
		confirmationLevel: user.confirmationLevel,
		isAdmin: user.isAdmin
  }, opts.secretOrKey);
};

export const verify = (token, done) => {
	if (token?._id && token?.confirmationLevel && token?.isAdmin !== undefined) {
    done(null, token);
  } else {
    done(null, false);
  }
};

export default new Strategy(opts, verify);
