import Http from 'http';

import initDB from './app/config/db';
import app from './app/app';
import config from './app/config/var';

const server = Http.createServer(app);

initDB()
  .then(() => {
    server.listen(config.port, (error) => {
      if (error) {
        console.log(`
              \n\n
              --------------------------------
              --------------------------------
    
              REST Guide:
    
              Status: Error
              Log: ${error}
    
              --------------------------------
              --------------------------------
              \n\n`
        );
      } else {
        console.log(`
              \n\n
              --------------------------------
              --------------------------------
    
              REST Guide:
    
              Status: OK
              Port: ${config.port}
    
              --------------------------------
              --------------------------------
              \n\n`
        );
      }
    });
  })
  .catch((e) => {
    console.log(`
          \n\n
          --------------------------------
          --------------------------------

          REST Guide:
          
          Status: Error
          Message: Database initialization failed
          Log: ${e}
          
          --------------------------------
          --------------------------------
          \n\n`
    );
  });
