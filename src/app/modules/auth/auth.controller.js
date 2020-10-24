import Bcrypt from 'bcryptjs';
import Crypto from 'crypto';

import User from '../../models/user';
import errors from '../../constants/errors';
import confirmationLevels from '../../constants/confirmation_levels';
import { createToken } from '../../config/authentication/jwt';
import * as helpers from './auth.helpers';
import * as twoFactorAuth from '../../config/authentication/two_factor_auth';
import {
  NotAuthenticated,
  NotFound,
  UnprocessableEntity,
  InternalError,
} from '../../utils/error';

/**
 * User registration
 */

export const registerUser = async (req, res, next) => {
  try {
    // Check for duplicate emails
    const result = await User.findOne({ email: req.body.email.toLowerCase() });

    if (result) {
      next(new UnprocessableEntity(errors.DUPLICATE_EMAILS));

      return;
    }

    // Store user
    const salt = await Bcrypt.genSalt();
    const hashedPassword = await Bcrypt.hash(req.body.password, salt);
    const body = new User({
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      confirmationToken: Crypto.randomBytes(32).toString('hex'),
      confirmationLevel: confirmationLevels.PENDING,
      isAdmin: false,
      twoFactorAuth: { active: false },
    });
    const createdUser = await body.save();

    // Send confirmation
    helpers.sendConfirmationEmail(createdUser, req.body.redirectUrl);

    res.sendStatus(204);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Resend confirmation email.
 */

export const resendConfirmationEmail = async (req, res, next) => {
  try {
    const query = {
      confirmationLevel: confirmationLevels.PENDING,
      email: req.body.email.toLowerCase(),
    };
    const update = {
      confirmationToken: Crypto.randomBytes(32).toString('hex'),
    };
    const result = await User.findOneAndUpdate(query, update);

    if (!result) {
      next(new NotFound(errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED));

      return;
    }

    await helpers.sendConfirmationEmail(
      result, 
      req.body.redirectUrl
    );

    res.sendStatus(204);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Confirm account controller
 */

export const confirmAccount = async (req, res, next) => {
  try {
    const query = {
      confirmationLevel: confirmationLevels.PENDING,
      confirmationToken: req.query.token,
    };
    const update = {
      confirmationToken: Crypto.randomBytes(32).toString('hex'),
      confirmationLevel: confirmationLevels.CONFIRMED,
    };
    const result = await User.findOneAndUpdate(query, update);

    if (!result) {
      next(new NotFound(errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED));

      return;
    }

    res.sendStatus(204);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Log in controller
 */

export const logIn = async (req, res, next) => {
  try {
    const result = await User.findOne({ email: req.body.email.toLowerCase() });

    // Check for email
    if (!result) {
      next(new NotAuthenticated(errors.USER_NOT_FOUND));

      return;
    }

    // Check for password
    const existingPassword = result.password;
    const passwordsMatch = await Bcrypt.compare(req.body.password, existingPassword);

    if (!passwordsMatch) {
      next(new NotAuthenticated(errors.INVALID_PASSWORD));

      return;
    }

    // Check for account confirmation
    if (result.confirmationLevel === confirmationLevels.PENDING) {
      next(new NotAuthenticated(errors.ACCOUNT_NOT_CONFIRMED));

      return;
    }

    // If everything is OK, generate a jwt and return the user object
    const sessionToken = createToken(result);
    const objectToReturn = {
      ...result.toJSON(),
      token: sessionToken
    };
    
    delete objectToReturn.password;
    delete objectToReturn.twoFactorAuth.secret;

    res.status(200).json(objectToReturn);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Request new password controller
 */

export const requestNewPassword = async (req, res, next) => {
  try {
    const confirmationToken = Crypto.randomBytes(32).toString('hex');
    const result = await User.findOneAndUpdate(
      { email: req.body.email.toLowerCase() },
      { confirmationToken },
      { new: true },
    );

    if (!result) {
      next(new NotFound(errors.USER_NOT_FOUND));

      return;
    }

    await helpers.sendEmailWithResetPasswordLink(
      result, 
      req.body.redirectUrl
    );

    res.sendStatus(204);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Reset password controller
 */

export const resetPassword = async (req, res, next) => {
  try {
    const salt = await Bcrypt.genSalt();
    const hashedPassword = await Bcrypt.hash(req.body.password, salt);
    const result = await User.findOneAndUpdate(
      { confirmationToken: req.body.token }, 
      { password: hashedPassword }
    );

    if (!result) {
      next(new NotFound(errors.USER_NOT_FOUND));

      return;
    }

    res.sendStatus(204);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Handler for setting up two factor authentication.
 * 1) A secret key is generated and stored in the user collection (but not active yet).
 * 2) A QR Code is generated, based on the secret key.
 * 3) The image base64 of the QR Code is sent back to the user.
 */

export const initTwoFactorAuthentication = async (req, res, next) => {
  try {
    // Get user object 
    const userResult = await User.findById(req.user._id);

    if (!userResult) {
      next(new NotFound(errors.USER_NOT_FOUND));

      return;
    }

    // Generate secret
    const secret = twoFactorAuth.generateSecret(userResult.email);
    const qrCodeBase64 = await twoFactorAuth.generateQRCode(secret);
    const update = { 'twoFactorAuth.secret': secret };
    const userUpdateResult = await User.findByIdAndUpdate(req.user._id, update);

    if (!userUpdateResult) {
      next(new NotFound(errors.USER_NOT_FOUND));

      return;
    }

    res.status(200).send(qrCodeBase64);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Handler for completing two factor authentication.
 * 1) A token (string) is received as a body argument.
 * 2) The token is validated against the stored secret.
 * 3) If it matches, the secret key for the user is verified (active becomes true).
 */

export const completeTwoFactorAuthentication = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const token = req.body.token;
    const userResult = await User.findById(userId);

    if (!userResult) {
      next(new NotFound(errors.USER_NOT_FOUND));

      return;
    }

    const tokenIsValid = twoFactorAuth.validateToken(
      userResult.twoFactorAuth.secret, 
      token
    );

    if (!tokenIsValid) {
      next(new UnprocessableEntity(errors.INVALID_2FA_TOKEN));

      return;
    }

    const update = { 'twoFactorAuth.active': true };

    await User.findByIdAndUpdate(userId, update);
    res.sendStatus(204);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Handler for verifying a 2FA token.
 * 1) A token (string) is received as a query parameter.
 * 2) The token is validated against the stored user secret.
 */

export const verifyTwoFactorAuthToken = async (req, res, next) => {
  try {
    const token = req.query.token;
    const userResult = await User.findById(req.user._id);

    if (!userResult) {
      next(new NotFound(errors.USER_NOT_FOUND));

      return;
    }

    if (!userResult.twoFactorAuth.active) {
      next(new UnprocessableEntity(errors.NO_2FA));

      return;
    }

    const tokenIsValid = twoFactorAuth.validateToken(
      userResult.twoFactorAuth.secret, 
      token
    );

    if (!tokenIsValid) {
      next(new UnprocessableEntity(errors.INVALID_2FA_TOKEN));

      return;
    }

    res.sendStatus(200);
  } catch (e) {
    next(new InternalError(e));
  }
};
