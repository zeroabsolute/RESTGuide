import Author from './authors.model';
import Book from '../../modules/books/books.model';
import User from '../auth/user.model';

export const findAuthor = async ({ query }) => {
  const dbQuery = {};

  if (query.equal) {
    Object.keys(query.equal).forEach((key) => {
      dbQuery[key] = {
        $eq: query.equal[key],
      };
    });
  }
  if (query.notEqual) {
    Object.keys(query.notEqual).forEach((key) => {
      dbQuery[key] = {
        $ne: query.notEqual[key],
      };
    });
  }

  const result = await Author.findOne(dbQuery);
  return result;
};

export const findAuthors = async ({ query, projection }) => {
  const result = await Author.find(query, projection);
  return result;
};

export const createUser = async ({ content }) => {
  const result = await User.create(content);
  return result;
};

export const createAuthor = async ({ content }) => {
  const result = await Author.create(content);
  return result;
};

export const updateAuthor = async ({ query, content }) => {
  const options = { new: true };
  const result = await Author.findOneAndUpdate(
    query,
    content,
    options,
  );
  return result;
};

export const deleteBooks = async ({ query }) => {
  await Book.deleteMany(query);
};

export const deleteUsers = async ({ query }) => {
  await User.deleteMany(query);
};

export const deleteAuthors = async ({ query }) => {
  await Author.deleteMany(query);
};

export const deleteOneAuthor = async ({ query }) => {
  await Author.findOneAndDelete(query);
};