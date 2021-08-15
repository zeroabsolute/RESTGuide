import Mongoose from 'mongoose';

import dbTables from '../constants/db_tables';

/**
 * @openapi
 * 
 * components:
 *   schemas:
 *     Book:
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         genre:
 *           type: string
 *         pages:
 *           type: integer
 *         publications:
 *           type: array
 *           items:
 *             type: string
 *             format: date
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *                 format: uri
 *         createdAt:
 *           type: string
 *           format: datetime
 *         updatedAt:
 *           type: string
 *           format: datetime
 */

const schema = new Mongoose.Schema(
  {
    title: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    author: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: dbTables.AUTHOR,
      required: true,
    },
    pages: {
      type: Mongoose.Schema.Types.Number,
      required: true,
    },
    genre: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    publications: [{
      date: {
        type: Mongoose.Schema.Types.Date,
        required: true,
      }
    }],
    images: [{
      name: {
        type: Mongoose.Schema.Types.String,
        required: true,
      },
      url: {
        type: Mongoose.Schema.Types.String,
        required: true,
      }
    }]
  },
  {
    timestamps: true,
    collection: dbTables.BOOK,
  },
);

export default Mongoose.model(dbTables.BOOK, schema);