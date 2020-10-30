import Joi from 'joi';

import { BadRequest } from '../../utils/error';
import { passwordRegex } from '../../helpers/validation';

/**
 * Validator for user registration
 */

export const registerUserValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(passwordRegex).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    redirectUrl: Joi.string().uri().required(),
  }).required();

  const result = schema.validate(req.body);

  if (result.error) {
    return next(new BadRequest(result?.error?.details));
  }

  return next();
};

/**
 * Validator for resend confirmation email request
 */

export const resendConfirmationEmailValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    redirectUrl: Joi.string().uri().required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return next(new BadRequest(result?.error?.details));
  }

  return next();
};

/**
 * Validator for account confirmation request
 */

export const confirmAccountValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
  });

  const result = schema.validate(req.query);

  if (result.error) {
    return next(new BadRequest(result?.error?.details));
  }

  return next();
};

/**
 * Validator for user log in request
 */

export const logInValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return next(new BadRequest(result?.error?.details));
  }

  return next();
};

/**
 * Validator for user password reset request.
 */

export const resetPasswordRequestValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    redirectUrl: Joi.string().uri().required(),
  }).required();

  const result = schema.validate(req.body);

  if (result.error) {
    return next(new BadRequest(result?.error?.details));
  }

  return next();
};

/**
 * Validator for user password reset.
 */

export const resetPasswordValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().regex(passwordRegex).required(),
  }).required();

  const result = schema.validate(req.body);

  if (result.error) {
    return next(new BadRequest(result?.error?.details));
  }

  return next();
};

/**
 * Validator for 2FA completion
 */

export const completeTwoFactorAuthValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return next(new BadRequest(result?.error?.details));
  }

  return next();
};

/**
 * Validator for 2FA token verification
 */

export const verifyTwoFactorAuthTokenValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
  });

  const result = schema.validate(req.query);

  if (result.error) {
    return next(new BadRequest(result?.error?.details));
  }

  return next();
};
