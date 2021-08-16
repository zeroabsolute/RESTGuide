import { Router } from 'express';
import Passport from 'passport';

import * as controller from './authors.controller';

const router = new Router();
const BASE_ROUTE = `/authors`;

/**
 * Create author.
 * 
 * @openapi
 * 
 * paths:
 *   /authors:
 *     post:
 *       tags:
 *         - Authors
 *       summary: Create author (Admin only)
 *       description: Adds a new author.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - firstName
 *                 - lastName
 *                 - genres
 *               properties:
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 genres:
 *                   type: array
 *                   minItems: 1
 *                   items:
 *                     type: string
 *       responses:
 *         201:
 *           description: Author created successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Author"
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         422:
 *           description: Unprocessable Entity
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 authorExists:
 *                   value:
 *                     code: ckgjkxvgl000431pp4xlpew2g
 *                     name: Unprocessable Entity
 *                     message: Your request was understood but could not be completed due to semantic errors
 *                     details: An author with the same name already exists
 *                   summary: Author exists
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(BASE_ROUTE).post(
  Passport.authenticate('jwt', { session: false }),
  controller.postAuthor,
);

/**
 * Read authors.
 * 
 * @openapi
 * 
 * paths:
 *   /authors:
 *     get:
 *       tags:
 *         - Authors
 *       summary: Read authors
 *       description: Reads authors. Supports search by genre and projected responses.
 *       parameters:
 *         - name: genre
 *           in: query
 *           description: Genre
 *           required: false
 *           schema:
 *             type: string
 *           example: "dystopian_fiction"
 *         - name: fields
 *           in: query
 *           description: Projected fields
 *           required: false
 *           schema:
 *             type: string
 *           example: "firstName,lastName,genres"
 *       responses:
 *         200:
 *           description: Authors read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/Author"
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(BASE_ROUTE).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getAuthors,
);

/**
 * Read author.
 * 
 * @openapi
 * 
 * paths:
 *   /authors/{id}:
 *     get:
 *       tags:
 *         - Authors
 *       summary: Read author
 *       description: Reads one author by Id.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Author Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Author read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Author"
 *         401:
 *           $ref: "#/components/responses/401"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/:id`).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getAuthor,
);

/**
 * Update author.
 * 
 * @openapi
 * 
 * paths:
 *   /authors/{id}:
 *     patch:
 *       tags:
 *         - Authors
 *       summary: Update author (Admin only)
 *       description: Updates an existing author.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Author Id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 genres:
 *                   type: array
 *                   minItems: 1
 *                   items:
 *                     type: string
 *       responses:
 *         204:
 *           description: Author updated successfully.
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         404:
 *           $ref: "#/components/responses/404"
 *         422:
 *           description: Unprocessable Entity
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 authorExists:
 *                   value:
 *                     code: ckgjkxvgl000431pp4xlpew2g
 *                     name: Unprocessable Entity
 *                     message: Your request was understood but could not be completed due to semantic errors
 *                     details: An author with the same name already exists
 *                   summary: Author exists
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/:id`).patch(
  Passport.authenticate('jwt', { session: false }),
  controller.patchAuthor,
);

/**
 * Delete author.
 * 
 * @openapi
 * 
 * paths:
 *   /authors/{id}:
 *     delete:
 *       tags:
 *         - Authors
 *       summary: Delete author (Admin only)
 *       description: Deletes an existing author.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Author Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         204:
 *           description: Author deleted successfully.
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/:id`).delete(
  Passport.authenticate('jwt', { session: false }),
  controller.deleteAuthor,
);

export default router;
