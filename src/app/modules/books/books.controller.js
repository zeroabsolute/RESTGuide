import Book from '../../models/book';
import { InternalError, NotFound } from '../../utils/error';

/**
 * Create book
 */

export const createBook = async (req, res, next) => {
  try {
    const body = new Book({ 
      ...req.body,
      publications: req.body.publications.map((item) => ({
        date: new Date(item)
      })),
    });
    const result = await body.save();

    res.status(201).json(result);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Read books
 */

export const readBooks = async (req, res, next) => {
  try {
    const query = {};
    const projection = req.query?.fields 
      ? req.query.fields.split(',') 
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

    if (req.query?.genre) {
      query.genre = {
        $regex: req.query.genre,
        $options: 'i',
      };
    }

    const result = await Book.find(query, projection);

    res.status(200).json(result);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Read one book
 */

export const readOneBook = async (req, res, next) => {
  try {
    const result = await Book
      .findById(req.params.id)
      .populate('author');

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
 * Update one book
 */

export const updateBook = async (req, res, next) => {
  try {
    const update = req.body;

    if (req.body.publications) {
      update.publications = req.body.publications.map((item) => ({
        date: new Date(item)
      }));
    }

    const result = await Book.findByIdAndUpdate(req.params.id, update);

    if (!result) {
      next(new NotFound());

      return;
    }

    res.sendStatus(204);
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Delete one book
 */

export const deleteBook = async (req, res, next) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id);

    if (!result) {
      next(new NotFound());

      return;
    }

    res.sendStatus(204);
  } catch (e) {
    next(new InternalError(e));
  }
};