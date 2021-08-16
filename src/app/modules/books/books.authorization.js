import { NotAuthorized } from '../../utils/error';

export const authorizeWriteRequest = ({ user }) => {
  if (!user.isAdmin) {
    throw new NotAuthorized();
  }
};