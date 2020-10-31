import Joi from 'joi';

import { BadRequest } from '../../utils/error';
import { commaSeparatedWords } from '../../constants/validation';

export const createAuthorValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    genres: Joi.array().items(Joi.string()).min(1).required(),
  }).required();

  const result = schema.validate(req.body);

  if (result.error) {
    return next(new BadRequest(result?.error?.details));
  }

  return next();
};

export const updateAuthorValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    genres: Joi.array().items(Joi.string()).min(1),
  }).required();

  const result = schema.validate(req.body);

  if (result.error) {
    return next(new BadRequest(result?.error?.details));
  }

  return next();
};

export const readAuthorsValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    genre: Joi.string(),
    fields: Joi.string().regex(commaSeparatedWords),
  });

  const result = schema.validate(req.query);

  if (result.error) {
    return next(new BadRequest(result?.error?.details));
  }

  return next();
};