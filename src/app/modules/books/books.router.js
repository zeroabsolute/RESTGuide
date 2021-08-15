import { Router } from 'express';
import Passport from 'passport';
import Multer from 'multer';

import * as controller from './books.controller';
import { multerConfigForMemoryStorage } from '../../config/file_upload';

const router = new Router();
const BASE_ROUTE = `/books`;

/**
 * Create book.
 * 
 * @openapi
 * 
 * paths:
 *   /books:
 *     post:
 *       tags:
 *         - Books
 *       summary: Create book (Admin only)
 *       description: Adds a new book.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - title
 *                 - author
 *                 - pages
 *                 - genre
 *                 - publications
 *               properties:
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 genre:
 *                   type: string
 *                 pages:
 *                   type: integer
 *                   minimum: 1
 *                 publications:
 *                   type: array
 *                   minItems: 1
 *                   items:
 *                     type: string
 *                     format: date
 *       responses:
 *         201:
 *           description: Book created successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Book"
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(BASE_ROUTE).post(
  Passport.authenticate('jwt', { session: false }),
  controller.postBook,
);

/**
 * Read books.
 * 
 * @openapi
 * 
 * paths:
 *   /books:
 *     get:
 *       tags:
 *         - Authors
 *       summary: Read books
 *       description: Reads books. Supports search by genre and projected responses.
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
 *           example: "title,genre"
 *       responses:
 *         200:
 *           description: Books read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/Book"
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(BASE_ROUTE).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getBooks,
);

/**
 * Read book.
 * 
 * @openapi
 * 
 * paths:
 *   /books/{id}:
 *     get:
 *       tags:
 *         - Books
 *       summary: Read book
 *       description: Reads one book by Id.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Book Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Book read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: "#/components/schemas/Book"
 *                 properties:
 *                   author:
 *                     allOf:
 *                       - $ref: "#/components/schemas/Author"
 *         401:
 *           $ref: "#/components/responses/401"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/:id`).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getBook,
);

/**
 * Update book.
 * 
 * @openapi
 * 
 * paths:
 *   /books/{id}:
 *     patch:
 *       tags:
 *         - Books
 *       summary: Update book (Admin only)
 *       description: Updates an existing book.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Book Id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 genre:
 *                   type: string
 *                 pages:
 *                   type: integer
 *                   minimum: 1
 *                 publications:
 *                   type: array
 *                   minItems: 1
 *                   items:
 *                     type: string
 *                     format: date
 *       responses:
 *         204:
 *           description: Book updated successfully.
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/:id`).patch(
  Passport.authenticate('jwt', { session: false }),
  controller.patchBook,
);

/**
 * Delete book.
 * 
 * @openapi
 * 
 * paths:
 *   /books/{id}:
 *     delete:
 *       tags:
 *         - Books
 *       summary: Delete book (Admin only)
 *       description: Deletes an existing book.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Book Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         204:
 *           description: Book deleted successfully.
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
  controller.deleteBook,
);

/**
 * Add book images.
 * 
 * @openapi
 * 
 * paths:
 *   /books/{id}/images/bulk:
 *     post:
 *       tags:
 *         - Books
 *       summary: Add book images (Admin only)
 *       description: Uplaod images for one book.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Book Id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 images::
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: binary
 *       responses:
 *         200:
 *           description: Images uploaded successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                   items:
 *                     properties:
 *                       status:
 *                         type: string
 *                         enum: ["SUCCESS", "ERROR"]
 *                       result:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Only if the upload succeeded
 *                           name:
 *                             type: string
 *                           url:
 *                             type: string
 *                             format: uri
 *                             description: Only if the upload succeeded
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/:id/images/bulk`).post(
  Passport.authenticate('jwt', { session: false }),
  Multer(multerConfigForMemoryStorage).array('images', 10),
  controller.postMultipleImages,
);

/**
 * Delete book image.
 * 
 * @openapi
 * 
 * paths:
 *   /books/{book_id}/images/{image_id}:
 *     delete:
 *       tags:
 *         - Books
 *       summary: Delete book image (Admin only)
 *       description: Delete an image from a book.
 *       parameters:
 *         - name: book_id
 *           in: path
 *           description: Book Id
 *           required: true
 *           schema:
 *             type: string
 *         - name: image_id
 *           in: path
 *           description: Image Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         204:
 *           description: Image deleted successfully.
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/:bookId/images/:imageId`).delete(
  Passport.authenticate('jwt', { session: false }),
  controller.deleteImage,
);

export default router;
