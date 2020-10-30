import Mongoose from 'mongoose';

import config from '../var';

Mongoose.Promise = global.Promise;
Mongoose.set('useNewUrlParser', true);
Mongoose.set('useFindAndModify', false);
Mongoose.set('useCreateIndex', true);

const init = () => {
  return new Promise((resolve, reject) => {
    Mongoose
      .connect(config.databaseUrl, {
        useNewUrlParser: true,
        poolSize: 20,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

export default init;