import Author from '../../modules/authors/authors.model';
import Book from '../../models/book';

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

export const deleteAuthors = async ({ query }) => {
  await Author.deleteMany(query);
};

export const deleteOneAuthor = async ({ query }) => {
  await Author.findOneAndDelete(query);
};