import Mongoose from 'mongoose';

import dbTables from '../../constants/db_tables';

/**
 * @openapi
 * 
 * components:
 *   schemas:
 *     User:
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         confirmationLevel:
 *           type: integer
 *           enum: [0, 1, 2]
 *           description: 0 = pending, 1 = confirmed, 2 = banned
 *         confirmationToken:
 *           type: string
 *         isAdmin:
 *           type: boolean
 *         twoFactorAuth:
 *           type: object
 *           properties:
 *             active:
 *               type: boolean
 *         createdAt:
 *           type: string
 *           format: datetime
 *         updatedAt:
 *           type: string
 *           format: datetime
 */

const schema = new Mongoose.Schema(
  {
    email: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    password: {
      type: Mongoose.Schema.Types.String,
      required: false
    },
    phoneNumber: {
      type: Mongoose.Schema.Types.String,
      required: false,
    },
    firstName: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    lastName: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    confirmationLevel: {
      type: Mongoose.Schema.Types.Number,
      required: true,
    },
    confirmationToken: {
      type: Mongoose.Schema.Types.String,
      required: true,
    },
    isAdmin: {
      type: Mongoose.Schema.Types.Boolean,
      default: false,
      required: true,
    },
    twoFactorAuth: {
      type: {
        active: {
          type: Mongoose.Schema.Types.Boolean,
          required: true,
          default: false
        },
        secret: {
          type: {
            ascii: { type: 'String' },
            hex: { type: 'String' },
            base32: { type: 'String' },
            otpauth_url: { type: 'String' },
          },
          required: false,
        },
      },
      required: true,
    },
  },
  {
    timestamps: true,
    collection: dbTables.USER,
  },
);

export default Mongoose.model(dbTables.USER, schema);