import Mongoose from 'mongoose';

import config from '../var';

Mongoose.Promise = global.Promise;
Mongoose.set('useNewUrlParser', true);
Mongoose.set('useFindAndModify', false);
Mongoose.set('useCreateIndex', true);

function init() {
  return new Promise((resolve, reject) => {
    Mongoose
      .connect(config.databaseUrl, { 
        useNewUrlParser: true, 
        connectTimeoutMS: 500, 
        poolSize: 20,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

export default init;