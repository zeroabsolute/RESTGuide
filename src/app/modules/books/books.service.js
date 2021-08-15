import * as validator from './books.validator';
import * as authorization from './books.authorization';
import * as dal from './books.dal';
import buckets from '../../constants/buckets';
import { uploadFile, removeFile } from '../../helpers/files';
import { NotFound } from '../../utils/error';


export const createBook = async ({ requestBody, user }) => {
  validator.validatePostBookRequest({ input: requestBody });
  authorization.authorizeWriteRequest({ user });

  const bookBody = {
    ...requestBody,
    publications: requestBody.publications.map((item) => ({
      date: new Date(item)
    })),
  };
  const createdBook = await dal.createBook({ content: bookBody });

  return createdBook;
};


export const readBooks = async ({ requestParams }) => {
  validator.validateGetBooksRequest({ input: requestParams });

  const query = {};
  const projection = requestParams?.fields
    ? requestParams.fields.split(',')
    : [
      'title',
      'author',
      'pages',
      'genre',
      'publications',
      'images',
      'createdAt',
      'updatedAt',
    ];

  if (requestParams?.genre) {
    query.genre = requestParams.genre;
  }

  const books = await dal.findBooks({ query, projection });
  return books;
};


export const readOneBook = async ({ bookId }) => {
  const book = await dal.findBookWithAuthorPayload({ _id: bookId });
  return book;
};


export const updateBook = async ({ bookId, requestBody, user }) => {
  validator.validatePatchBookRequest({ input: requestBody });
  authorization.authorizeWriteRequest({ user });

  const update = requestBody;

  if (requestBody.publications) {
    update.publications = requestBody.publications.map((item) => ({
      date: new Date(item)
    }));
  }

  const updatedBook = await dal.updateBook({
    query: { _id: bookId },
    content: update,
  });

  if (!updatedBook) {
    throw new NotFound();
  }
};


export const deleteBook = async ({ bookId, user }) => {
  authorization.authorizeWriteRequest({ user });

  const deletedBook = await dal.deleteOneBook({ _id: bookId });

  if (!deletedBook) {
    throw new NotFound();
  }
};


export const uploadImages = async ({ bookId, user, files }) => {
  authorization.authorizeWriteRequest({ user });

  const book = await dal.findBook({ query: { _id: bookId } });

  if (!book) {
    throw new NotFound();
  }

  const result = [];
  const itemsToAdd = [];
  const errors = [];

  for (let i = 0; i < files.length; i += 1) {
    await handleSingleImageUpload({
      file: files[i],
      itemsToAdd,
      result,
      errors,
    });
  }

  const updatedBook = await dal.updateBookAttachments({
    query: { _id: bookId },
    toAdd: itemsToAdd,
  });
  const finalResult = [];

  prepareResponse({ result, finalResult, updatedBook });
  return finalResult;
};

async function handleSingleImageUpload({ file, itemsToAdd, result, errors }) {
  try {
    const uploadResult = await uploadFile(file, buckets.DEFAULT);

    itemsToAdd.push({
      name: uploadResult.name,
      url: uploadResult.url,
    });
    result.push({
      status: 'SUCCESS',
      result: {
        name: uploadResult.name,
        url: uploadResult.url,
      },
    });
  } catch (e) {
    errors.push(e);
    result.push({
      status: 'ERROR',
      result: {
        name: file.originalname,
      },
    });
  }
}

function prepareResponse({ result, finalResult, updatedBook }) {
  result.forEach((item) => {
    if (item.status === 'SUCCESS') {
      const dbImage = updatedBook.images.find(
        (i) => i.url === item.result.url
      );
      finalResult.push({
        ...item,
        result: {
          ...item.result,
          _id: dbImage._id
        }
      });
    } else {
      finalResult.push(item);
    }
  });
}


export const deleteImage = async ({ user, bookId, imageId }) => {
  authorization.authorizeWriteRequest({ user });

  const book = await dal.findBook({ query: { _id: bookId } });

  if (!book) {
    throw new NotFound();
  }

  const itemToDelete = book.images.find((item) => item._id.equals(imageId));

  if (!itemToDelete) {
    throw new NotFound();
  }

  await removeFile(itemToDelete.url, buckets.DEFAULT);
  await dal.updateBookAttachments({
    query: { _id: bookId },
    toRemove: [itemToDelete._id],
  });
};