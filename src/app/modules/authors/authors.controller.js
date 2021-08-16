import * as service from './authors.service';

export const postAuthor = async (req, res, next) => {
  try {
    const result = await service.createAuthor({
      requestBody: req.body,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const getAuthors = async (req, res, next) => {
  try {
    const result = await service.readAuthors({ requestParams: req.query });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const getAuthor = async (req, res, next) => {
  try {
    const result = await service.readOneAuthor({ authorId: req.params.id });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const patchAuthor = async (req, res, next) => {
  try {
    await service.updateAuthor({
      authorId: req.params.id,
      requestBody: req.body,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const deleteAuthor = async (req, res, next) => {
  try {
    await service.deleteAuthor({
      authorId: req.params.id,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};