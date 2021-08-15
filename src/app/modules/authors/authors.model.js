import Mongoose from 'mongoose';

import dbTables from '../../constants/db_tables';

/**
 * @openapi
 * 
 * components:
 *   schemas:
 *     Author:
 *       properties:
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: datetime
 *         updatedAt:
 *           type: string
 *           format: datetime
 */

const schema = new Mongoose.Schema(
  {
    firstName: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    lastName: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    genres: [{
      type: Mongoose.Schema.Types.String,
      required: true,
    }],
  },
  {
    timestamps: true,
    collection: dbTables.AUTHOR,
  },
);

export default Mongoose.model(dbTables.AUTHOR, schema);