import BaseJoi from 'joi';
import DateJoi from '@hapi/joi-date';

import { BadRequest } from '../../utils/error';
import { commaSeparatedWords } from '../../constants/validation';
import datetimeFormats from '../../constants/datetime_formats';

const Joi = BaseJoi.extend(DateJoi);

export const validateCreateBookRequest = ({ input }) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    author: Joi.string().required(),
    pages: Joi.number().integer().min(1).required(),
    genre: Joi.string().required(),
    publications: Joi
      .array()
      .items(Joi.date().format(datetimeFormats.STANDARD_DATE))
      .required(),
  }).required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validateGetBooksRequest = ({ input }) => {
  const schema = Joi.object().keys({
    genre: Joi.string(),
    fields: Joi.string().regex(commaSeparatedWords),
  });

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validatePatchBookRequest = ({ input }) => {
  const schema = Joi.object().keys({
    title: Joi.string(),
    author: Joi.string(),
    pages: Joi.number().integer().min(1),
    genre: Joi.string(),
    publications: Joi
      .array()
      .items(Joi.date().format(datetimeFormats.STANDARD_DATE)),
  }).required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};