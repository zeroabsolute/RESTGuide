import Joi from 'joi';

import { BadRequest } from '../../utils/error';
import { commaSeparatedWords } from '../../constants/validation';

export const validateCreateAuthorRequest = ({ input }) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    genres: Joi.array().items(Joi.string()).min(1).required(),
  }).required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validateGetAuthorsRequest = ({ input }) => {
  const schema = Joi.object().keys({
    genre: Joi.string(),
    fields: Joi.string().regex(commaSeparatedWords),
  });

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validatePatchAuthorRequest = ({ input }) => {
  const schema = Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    genres: Joi.array().items(Joi.string()).min(1),
  }).required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};