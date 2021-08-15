import * as validator from './authors.validator';
import * as authorization from './authors.authorization';
import * as dal from './authors.dal';
import errors from '../../constants/errors';
import { UnprocessableEntity, NotFound } from '../../utils/error';


export const createAuthor = async ({ requestBody, user }) => {
  validator.validateCreateAuthorRequest({ input: requestBody });
  authorization.authorizeWriteRequest({ user });

  const existingAuthor = await dal.findAuthor({
    query: {
      equal: {
        firstName: requestBody.firstName,
        lastName: requestBody.lastName,
      },
    },
  });

  if (existingAuthor) {
    throw new UnprocessableEntity(errors.AUTHOR_EXISTS);
  }

  const createdAuthor = await dal.createAuthor({ content: requestBody });
  return createdAuthor;
};


export const readAuthors = async ({ requestParams }) => {
  validator.validateGetAuthorsRequest({ input: requestParams });

  const query = {};
  const projection = requestParams?.fields
    ? requestParams.fields.split(',')
    : [
      'firstName',
      'lastName',
      'genres',
      'createdAt',
      'updatedAt'
    ];

  if (requestParams?.genres) {
    query.genres = requestParams.genre;
  }

  const authors = await dal.findAuthors({ query, projection });
  return authors;
};


export const readOneAuthor = async ({ authorId }) => {
  const author = await dal.findAuthor({
    query: { equal: { _id: authorId } },
  });

  if (!author) {
    throw new NotFound();
  }
};


export const updateAuthor = async ({ authorId, requestBody, user }) => {
  validator.validatePatchAuthorRequest({ input: requestBody });
  authorization.authorizeWriteRequest({ user });

  const author = await dal.findAuthor({
    query: { _id: authorId },
  });

  if (!author) {
    throw new NotFound();
  }

  if (requestBody.firstName || requestBody.lastName) {
    const newFirstName = requestBody.firstName || author.firstName;
    const newLastName = requestBody.lastName || author.lastName;
    const existingAuthor = await dal.findAuthor({
      query: {
        equal: {
          firstName: newFirstName,
          lastName: newLastName,
        },
        notEqual: {
          _id: authorId,
        },
      },
    });

    if (existingAuthor) {
      throw new UnprocessableEntity(errors.AUTHOR_EXISTS);
    }
  }

  await dal.updateAuthor({
    query: { _id: authorId },
    content: requestBody,
  });
};


export const deleteAuthor = async ({ user, authorId }) => {
  authorization.authorizeWriteRequest({ user });

  const deletedAuthor = await dal.deleteOneAuthor({ _id: authorId });

  if (!deletedAuthor) {
    throw new NotFound();
  }

  await dal.deleteBooks({ author: authorId });
};