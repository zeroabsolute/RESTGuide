import Mongoose from 'mongoose';

import dbTables from '../constants/db_tables';

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
    }
  },
  { 
    timestamps: true,
    collection: dbTables.USER,
  },
);

export default Mongoose.model(dbTables.USER, schema);