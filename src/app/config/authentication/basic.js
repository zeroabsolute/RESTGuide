import BasicAuth from 'express-basic-auth';

const auth = (userName, password, challenge) =>
  BasicAuth({
    users: {
      [userName]: password
    },
    challenge
  });

export default auth;
