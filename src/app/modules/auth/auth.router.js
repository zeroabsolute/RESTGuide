import Passport from 'passport';
import { Router } from 'express';

import * as controller from './auth.controller';
import * as validator from './auth.validator';

const router = new Router();
const BASE_ROUTE = '/auth';

/**
 * User registration.
 * 
 * @openapi
 * 
 * paths:
 *   /auth/register:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Sign up
 *       description: Adds a new user account and sends a confirmation email
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - email
 *                 - password
 *                 - firstName
 *                 - lastName
 *                 - redirectUrl
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 password:
 *                   type: string
 *                   format: password
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 redirectUrl:
 *                   type: string
 *                   format: uri
 *       responses:
 *         204:
 *           description: User created successfully
 *         400:
 *           $ref: "#/components/responses/400"
 *         422:
 *           description: Unprocessable Entity
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 emailExists:
 *                   value:
 *                     code: ckgjkxvgl000431pp4xlpew2g
 *                     name: Unprocessable Entity
 *                     message: Your request was understood but could not be completed due to semantic errors
 *                     details: An account with the given email already exists
 *                   summary: Email exists
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/register`).post(
  validator.registerUserValidator,
  controller.registerUser,
);

/**
 * Resend confirmation email.
 * 
 * @openapi
 * 
 * paths:
 *   /auth/resend-confirmation-email:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Resend confirmation email
 *       description: Resends a confirmation email to the given email address
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - email
 *                 - redirectUrl
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 redirectUrl:
 *                   type: string
 *                   format: uri
 *       responses:
 *         204:
 *           description: Email sent successfully.
 *         400:
 *           $ref: "#/components/responses/400"
 *         404:
 *           description: Not Found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 userNotFoundOrConfirmed:
 *                   value:
 *                     code: ckgjkxvgl000431pp4xlpew2g
 *                     name: Not Found
 *                     message: The requested item was not found
 *                     details: The requested user does not exist, or the account is already confirmed
 *                   summary: User not found or account confirmed
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/resend-confirmation-email`).post(
  validator.resendConfirmationEmailValidator,
  controller.resendConfirmationEmail,
);

/**
 * Account confirmation.
 * 
 * @openapi
 * 
 * paths:
 *   /auth/confirmation:
 *     put:
 *       tags:
 *         - Authentication
 *       summary: Confirm account
 *       description: Sets user confirmation level to "confirmed"
 *       parameters:
 *         - name: token
 *           in: query
 *           description: User confirmation token
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         204:
 *           description: Account confirmed successfully.
 *         400:
 *           $ref: "#/components/responses/400"
 *         404:
 *           description: Not Found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 userNotFoundOrConfirmed:
 *                   value:
 *                     code: ckgjkxvgl000431pp4xlpew2g
 *                     name: Not Found
 *                     message: The requested item was not found
 *                     details: The requested user does not exist, or the account is already confirmed
 *                   summary: User not found or account confirmed
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/confirmation`).put(
  validator.confirmAccountValidator,
  controller.confirmAccount,
);

/**
 * User log in.
 * 
 * @openapi
 * 
 * paths:
 *   /auth/login:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Log in
 *       description: Authenticate with email and password
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - email
 *                 - password
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 password:
 *                   type: string
 *                   format: password
 *       responses:
 *         200:
 *           description: User successfully authenticated.
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: "#/components/schemas/User"
 *                 properties:
 *                   token:
 *                     type: string
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           description: Not Authenticated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 userNotFound:
 *                   value:
 *                     code: ckgjkxvgl000431pp4xlpew2g
 *                     name: Not Authenticated
 *                     message: Missing authentication or invalid credentials
 *                     details: The requested user does not exist in our database
 *                   summary: User not found
 *                 invalidPassword:
 *                   value:
 *                     code: ckgjkxvgl000431pp4xlpew2g
 *                     name: Not Authenticated
 *                     message: Missing authentication or invalid credentials
 *                     details: The provided password is incorrect
 *                   summary: Invalid password
 *                 notConfirmed:
 *                   value:
 *                     code: ckgjkxvgl000431pp4xlpew2g
 *                     name: Not Authenticated
 *                     message: Missing authentication or invalid credentials
 *                     details: Your account is not confirmed
 *                   summary: Account not confirmed
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/login`).post(
  validator.logInValidator,
  controller.logIn,
);

/**
 * Request new password.
 * 
 * @openapi
 * 
 * paths:
 *   /auth/request-new-password:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Request new password
 *       description: Sends an email with the reset password instructions
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - email
 *                 - redirectUrl
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 redirectUrl:
 *                   type: string
 *                   format: uri
 *       responses:
 *         204:
 *           description: Email sent successfully.
 *         400:
 *           $ref: "#/components/responses/400"
 *         404:
 *           description: Not Found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 userNotFound:
 *                   $ref: "#/components/examples/UserNotFound"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/request-new-password`).post(
  validator.resetPasswordRequestValidator,
  controller.requestNewPassword
);

/**
 * Reset password.
 * 
 * @openapi
 * 
 * paths:
 *   /auth/password:
 *     put:
 *       tags:
 *         - Authentication
 *       summary: Reset password
 *       description: Resets the user password
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - token
 *                 - password
 *               properties:
 *                 token:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         204:
 *           description: Password updated successfully.
 *         400:
 *           $ref: "#/components/responses/400"
 *         404:
 *           description: Not Found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 userNotFound:
 *                   $ref: "#/components/examples/UserNotFound"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/password`).put(
  validator.resetPasswordValidator,
  controller.resetPassword
);

/**
 * Initialize two factor authentication.
 * 
 * @openapi
 * 
 * paths:
 *   /auth/two-factor-auth/initialization:
 *     put:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Authentication
 *       summary: Initialize two-factor authentication
 *       description: Generates a QR code and returns it to the client.
 *       responses:
 *         200:
 *           description: QR Code generated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 description: Base64 representation of the QR Code
 *                 type: string
 *                 format: base64
 *         401:
 *           $ref: "#/components/responses/401"
 *         404:
 *           description: Not Found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 userNotFound:
 *                   $ref: "#/components/examples/UserNotFound"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/two-factor-auth/initialization`).put(
  Passport.authenticate('jwt', { session: false }),
  controller.initTwoFactorAuthentication,
);

/**
 * Finalize the setup for the two factor authentication.
 * 
 * @openapi
 * 
 * paths:
 *   /auth/two-factor-auth/activation:
 *     put:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Authentication
 *       summary: Activate two-factor authentication
 *       description: Receives a token from the user and validates it. If the token is valid, the two-factor authentication becomes active.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - token
 *               properties:
 *                 token:
 *                   description: Token generated from a third party app (e.g. Google Authenticator)
 *                   type: string
 *       responses:
 *         204:
 *           description: Two-factor-authentication activated successfully
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         404:
 *           description: Not Found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 userNotFound:
 *                   $ref: "#/components/examples/UserNotFound"
 *         422:
 *           description: Unprocessable Entity
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 invalidToken:
 *                   value:
 *                     code: ckgjkxvgl000431pp4xlpew2g
 *                     name: Unprocessable Entity
 *                     message: Your request was understood but could not be completed due to semantic errors
 *                     details: The provided token is not valid
 *                   summary: Invalid token
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/two-factor-auth/activation`).put(
  Passport.authenticate('jwt', { session: false }),
  validator.completeTwoFactorAuthValidator,
  controller.completeTwoFactorAuthentication,
);

/**
 * Verify two factor authentication token.
 * 
 * @openapi
 * 
 * paths:
 *   /auth/two-factor-auth/verification:
 *     head:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Authentication
 *       summary: Verify two factor authentication token
 *       description: Receives a token from the user and validates it.
 *       parameters:
 *         - name: token
 *           in: query
 *           description: Token generated from a third party app (e.g. Google Authenticator)
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Token is valid
 *         400:
 *           description: Bad Request
 *         401:
 *           description: Not Authenticated
 *         404:
 *           description: Not Found
 *         422:
 *           description: Unprocessable Entity
 *         500:
 *           description: Internal Server Error
 */

router.route(`${BASE_ROUTE}/two-factor-auth/verification`).head(
  Passport.authenticate('jwt', { session: false }),
  validator.verifyTwoFactorAuthTokenValidator,
  controller.verifyTwoFactorAuthToken,
);


export default router;