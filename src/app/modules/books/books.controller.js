import * as service from './books.service';

export const postBook = async (req, res, next) => {
  try {
    const result = await service.createBook({
      requestBody: req.body,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const getBooks = async (req, res, next) => {
  try {
    const result = await service.readBooks({ requestParams: req.query });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const getBook = async (req, res, next) => {
  try {
    const result = await service.readOneBook({ bookId: req.params.id });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const patchBook = async (req, res, next) => {
  try {
    await service.updateBook({
      bookId: req.params.id,
      requestBody: req.body,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    await service.deleteBook({
      bookId: req.params.id,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const postMultipleImages = async (req, res, next) => {
  try {
    const result = await service.uploadImages({
      user: req.user,
      bookId: req.params.id,
      files: req.files,
    });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    await service.deleteImage({
      bookId: req.params.bookId,
      imageId: req.params.imageId,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};