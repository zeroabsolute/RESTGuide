import Bcrypt from 'bcryptjs';
import Crypto from 'crypto';

import * as validator from './auth.validator';
import * as dal from './auth.dal';
import * as helpers from './auth.helpers';
import * as twoFactorAuth from '../../config/authentication/two_factor_auth';
import errors from '../../constants/errors';
import confirmationLevels from '../../constants/confirmation_levels';
import { createToken } from '../../config/authentication/jwt';
import {
  NotAuthenticated,
  NotFound,
  UnprocessableEntity,
} from '../../utils/error';


export const registerUser = async ({ requestBody }) => {
  validator.validateUserSignUpRequest({ input: requestBody });

  const userWithTheSameEmail = await dal.findUser({
    query: {
      email: requestBody.email.toLowerCase(),
    },
  });

  if (userWithTheSameEmail) {
    throw new UnprocessableEntity(errors.DUPLICATE_EMAILS);
  }

  const salt = await Bcrypt.genSalt();
  const hashedPassword = await Bcrypt.hash(requestBody.password, salt);
  const newUserBody = {
    email: requestBody.email.toLowerCase(),
    password: hashedPassword,
    firstName: requestBody.firstName,
    lastName: requestBody.lastName,
    confirmationToken: Crypto.randomBytes(32).toString('hex'),
    confirmationLevel: confirmationLevels.PENDING,
    isAdmin: false,
    twoFactorAuth: { active: false },
  };
  const createdUser = await dal.createUser({ content: newUserBody });

  helpers.sendConfirmationEmail({
    user: createdUser,
    redirectUrl: requestBody.redirectUrl,
  });

  return createdUser;
};


export const resendConfirmationEmail = async ({ requestBody }) => {
  validator.validateResendConfirmationEmailRequest({ input: requestBody });

  const query = {
    confirmationLevel: confirmationLevels.PENDING,
    email: requestBody.email.toLowerCase(),
  };
  const update = {
    confirmationToken: Crypto.randomBytes(32).toString('hex'),
  };
  const updatedUser = await dal.updateUser({
    query,
    content: update,
  });

  if (!updatedUser) {
    throw new NotFound(errors.USER_NOT_FOUND);
  }

  await helpers.sendConfirmationEmail({
    user: updatedUser,
    redirectUrl: requestBody.redirectUrl,
  });

  return updatedUser;
};


export const confirmAccount = async ({ requestParams }) => {
  validator.validateConfirmAccountRequest({ input: requestParams });

  const query = {
    confirmationLevel: confirmationLevels.PENDING,
    confirmationToken: requestParams.token,
  };
  const update = {
    confirmationToken: Crypto.randomBytes(32).toString('hex'),
    confirmationLevel: confirmationLevels.CONFIRMED,
  };
  const updatedUser = await dal.updateUser({
    query,
    content: update,
  });

  if (!updatedUser) {
    throw new NotFound(errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED);
  }

  return updatedUser;
};


export const logIn = async ({ requestBody }) => {
  validator.validateLogInRequest({ input: requestBody });

  const user = await dal.findUser({ query: { email: requestBody.email.toLowerCase() } });

  checkIfEmailExists(user);
  await checkIfPasswordsMatch(user.password, requestBody.password);
  checkIfUserAccountIsNotConfirmed(user.confirmationLevel);

  const sessionToken = createToken(user);
  const userWithToken = {
    ...user.toJSON(),
    token: sessionToken,
  };

  delete userWithToken.password;
  delete userWithToken.twoFactorAuth.secret;

  return userWithToken;
};

function checkIfEmailExists(user) {
  if (!user) {
    throw new NotAuthenticated(errors.USER_NOT_FOUND);
  }
}

async function checkIfPasswordsMatch(existingPassword, givenPassword) {
  const passwordsMatch = await Bcrypt.compare(givenPassword, existingPassword);

  if (!passwordsMatch) {
    throw new NotAuthenticated(errors.INVALID_PASSWORD);
  }
}

function checkIfUserAccountIsNotConfirmed(currentConfirmationLevel) {
  const accountNotConfirmed = currentConfirmationLevel === confirmationLevels.PENDING;

  if (accountNotConfirmed) {
    throw new NotAuthenticated(errors.ACCOUNT_NOT_CONFIRMED);
  }
}


export const requestNewPassword = async ({ requestBody }) => {
  validator.validateResetPasswordRequest({ input: requestBody });

  const confirmationToken = Crypto.randomBytes(32).toString('hex');
  const query = { email: requestBody.email.toLowerCase() };
  const update = { confirmationToken };
  const updatedUser = await dal.updateUser({
    query,
    content: update,
  });

  checkIfUserAccountExists(updatedUser);
  await helpers.sendEmailWithResetPasswordLink({
    user: updatedUser,
    redirectUrl: requestBody.redirectUrl,
  });
};

function checkIfUserAccountExists(user) {
  if (!user) {
    throw new NotFound(errors.USER_NOT_FOUND);
  }
}


export const resetPassword = async ({ requestBody }) => {
  validator.validatePasswordUpdateRequest({ input: requestBody });

  const salt = await Bcrypt.genSalt();
  const hashedPassword = await Bcrypt.hash(requestBody.password, salt);
  const query = { confirmationToken: requestBody.token };
  const update = { password: hashedPassword };
  const updatedUser = await dal.updateUser({
    query,
    content: update,
  });

  checkIfUserAccountExists(updatedUser);
};


export const initTwoFactorAuthentication = async ({ userId }) => {
  const query = { _id: userId };
  const user = await dal.findUser({ query });

  checkIfUserAccountExists(user);

  const secret = twoFactorAuth.generateSecret(user.email);
  const qrCodeBase64 = await twoFactorAuth.generateQRCode(secret);
  await dal.updateUser({
    query,
    content: { 'twoFactorAuth.secret': secret },
  });

  return qrCodeBase64;
};


export const completeTwoFactorAuthentication = async ({ userId, requestBody }) => {
  validator.validateCompleteTwoFactorAuthRequest({ input: requestBody });

  const token = requestBody.token;
  const query = { _id: userId };
  const user = await dal.findUser({ query });

  checkIfUserAccountExists(user);
  checkIfTokenIsValid(user, token);

  const update = { 'twoFactorAuth.active': true };
  await dal.updateUser({
    query,
    content: update,
  });
};

function checkIfTokenIsValid(user, token) {
  const tokenIsNotValid = twoFactorAuth.validateToken(
    user.twoFactorAuth.secret,
    token,
  );

  if (tokenIsNotValid) {
    throw new UnprocessableEntity(errors.INVALID_2FA_TOKEN);
  }
}


export const verifyTwoFactorAuthToken = async (userId, requestParams) => {
  validator.validateVerifyTwoFactorAuthTokenRequest({ input: requestParams });

  const token = requestParams.token;
  const user = await dal.findUser({ query: { _id: userId } });

  checkIfUserAccountExists(user);
  checkIfTwoFactorAuthIsActivated(user);
  checkIfTokenIsValid(user, token);
};

function checkIfTwoFactorAuthIsActivated(user) {
  if (!user.twoFactorAuth.active) {
    throw new UnprocessableEntity(errors.NO_2FA);
  }
}
