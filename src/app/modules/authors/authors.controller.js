import Author from '../../models/author';
import Book from '../../models/book';
import errors from '../../constants/errors';
import { 
  InternalError, 
  UnprocessableEntity,
  NotFound,
} from '../../utils/error';

/**
 * Create author
 */

export const createAuthor = async (req, res, next) => {
  try {
    const existingAuthor = await Author.findOne({ 
      firstName: req.body.firstName,
      lastName: req.body.lastName, 
    });

    if (existingAuthor) {
      next(new UnprocessableEntity(errors.AUTHOR_EXISTS));

      return;
    }

    const body = new Author({ ...req.body });
    const result = await body.save();

    res.status(201).json(result);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Read authors
 */

export const readAuthors = async (req, res, next) => {
  try {
    const query = {};
    const projection = req.query?.fields 
      ? req.query.fields.split(',') 
      : [
          'firstName', 
          'lastName', 
          'genres',
          'createdAt',
          'updatedAt'
        ];

    if (req.query?.genres) {
      query.genres = req.query.genre;
    }

    const result = await Author.find(query, projection);

    res.status(200).json(result);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Read one author
 */

export const readOneAuthor = async (req, res, next) => {
  try {
    const result = await Author.findById(req.params.id);

    if (!result) {
      next(new NotFound());

      return;
    }

    res.status(200).json(result);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Update one author
 */

export const updateAuthor = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      next(new NotFound());

      return;
    }

    if (req.body.firstName || req.body.lastName) {
      const newFirstName = req.body.firstName || author.firstName;
      const newLastName = req.body.lastName || author.lastName;
      const query = {
        firstName: newFirstName,
        lastName: newLastName,
        _id: { $ne: author._id },
      };
      const existingAuthor = await Author.findOne(query);
      
      if (existingAuthor) {
        next(new UnprocessableEntity(errors.AUTHOR_EXISTS));
  
        return;
      }
    }

    const update = req.body;
    await Author.findByIdAndUpdate(req.params.id, update);

    res.sendStatus(204);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Delete one author
 */

export const deleteAuthor = async (req, res, next) => {
  try {
    const result = await Author.findByIdAndDelete(req.params.id);

    if (!result) {
      next(new NotFound());

      return;
    }

    await Book.deleteMany({ author: req.params.id });
    res.sendStatus(204);
  } catch (e) {
    next(new InternalError(e));
  }
};