import Book from './books.model';
import User from '../auth/user.model';
import Author from '../authors/authors.model';

export const findBooks = async ({ query, projection }) => {
  const dbQuery = {};

  if (query.genre) {
    dbQuery.genre = {
      $regex: query.genre,
      $options: 'i',
    };
  }

  const result = await Book.find(dbQuery, projection);
  return result;
};

export const findBook = async ({ query }) => {
  const result = await Book.findOne(query);
  return result;
};

export const findBookWithAuthorPayload = async ({ query }) => {
  const result = await Book.findOne(query).populate('author');
  return result;
};

export const createBook = async ({ content }) => {
  const result = await Book.create(content);
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

export const updateBook = async ({ query, content }) => {
  const options = { new: true };
  const result = await Book.findOneAndUpdate(
    query,
    content,
    options,
  );
  return result;
};

export const updateBookAttachments = async ({ query, toAdd, toRemove }) => {
  const update = {};

  if (toAdd) {
    update.$push = {
      images: {
        $each: toAdd,
      },
    };
  }
  if (toRemove) {
    update.$pull = {
      images: {
        _id: {
          $in: toRemove,
        }
      }
    };
  }

  const result = await Book.findOneAndUpdate(
    query,
    update,
    { new: true }
  );
  return result;
};

export const deleteOneBook = async ({ query }) => {
  const result = await Book.findOneAndDelete(query);
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