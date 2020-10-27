import { NotAuthorized } from '../../utils/error';

/**
 * Checks whether the user is an admin to create/update/delete authors
 */

export const updateAuthorAuthorization = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new NotAuthorized());
  }

  return next();
};
