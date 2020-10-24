import Passport from 'passport';
import { Router } from 'express';

import * as controller from './auth.controller';
import * as validator from './auth.validator';

const router = new Router();
const BASE_ROUTE = '/auth';

export const routes = {
  REGISTRATION: `${BASE_ROUTE}/registration`,
  RESEND_CONFIRMATION: `${BASE_ROUTE}/resend-confirmation-email`,
  CONFIRM_ACCOUNT: `${BASE_ROUTE}/confirmation`,
  LOG_IN: `${BASE_ROUTE}/login`,
  REQUEST_PASSWORD: `${BASE_ROUTE}/request-new-password`,
  RESET_PASSWORD: `${BASE_ROUTE}/password`,
  INIT_2FA: `${BASE_ROUTE}/two-factor-auth/initialization`,
  ACTIVATE_2FA: `${BASE_ROUTE}/two-factor-auth/activation`,
  VERIFY_2FA: `${BASE_ROUTE}/two-factor-auth/verification`,
};

router.route(routes.REGISTRATION).post(
  validator.registerUserValidator,
  controller.registerUser,
);

router.route(routes.RESEND_CONFIRMATION).post(
  validator.resendConfirmationEmailValidator,
  controller.resendConfirmationEmail,
);

router.route(routes.CONFIRM_ACCOUNT).put(
  validator.confirmAccountValidator,
  controller.confirmAccount,
);

router.route(routes.LOG_IN).post(
  validator.logInValidator,
  controller.logIn,
);

router.route(routes.REQUEST_PASSWORD).post(
  validator.resetPasswordRequestValidator,
  controller.requestNewPassword
);

router.route(routes.RESET_PASSWORD).put(
  validator.resetPasswordValidator,
  controller.resetPassword
);

router.route(routes.INIT_2FA).put(
  Passport.authenticate('jwt', { session: false }),
  controller.initTwoFactorAuthentication,
);

router.route(routes.ACTIVATE_2FA).put(
  Passport.authenticate('jwt', { session: false }),
  validator.completeTwoFactorAuthValidator,
  controller.completeTwoFactorAuthentication,
);

router.route(routes.VERIFY_2FA).head(
  Passport.authenticate('jwt', { session: false }),
  validator.verifyTwoFactorAuthTokenValidator,
  controller.verifyTwoFactorAuthToken,
);


export default router;