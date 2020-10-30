import Mongoose from 'mongoose';

import dbTables from '../constants/db_tables';

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