import User from '../../modules/auth/user.model';

export const findUser = async ({ query }) => {
  const result = await User.findOne(query);
  return result;
};

export const createUser = async ({ content }) => {
  const result = await User.create(content);
  return result;
};

export const updateUser = async ({ query, content }) => {
  const options = { new: true };
  const result = await User.findOneAndUpdate(
    query,
    content,
    options,
  );
  return result;
};

export const deleteUsers = async ({ query }) => {
  await User.deleteMany(query);
};
