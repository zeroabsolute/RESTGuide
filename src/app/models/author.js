import Mongoose from 'mongoose';

import dbTables from '../constants/db_tables';

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