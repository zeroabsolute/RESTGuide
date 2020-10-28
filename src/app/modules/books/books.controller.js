import Book from '../../models/book';
import { InternalError, NotFound } from '../../utils/error';
import { uploadFile, removeFile } from '../../helpers/files';
import buckets from '../../constants/buckets';

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

/**
 * Upload images
 */

export const uploadImages = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      next(new NotFound());

      return;
    }

    const result = [];
    const itemsToAdd = [];
    const errors = [];

    for (let i = 0; i < req.files.length; i += 1) {
      try {
        const uploadResult = await uploadFile(req.files[i], buckets.DEFAULT);

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
            name: req.files[i].originalname,
          },
        });
      }
    }

    const updateResult = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          images: {
            $each: itemsToAdd,
          },
        }
      },
      { new: true }
    );

    const finalResult = [];
    
    result.forEach((item) => {
      if (item.status === 'SUCCESS') {
        const dbImage = updateResult.images.find(
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
    
    res.status(200).json(finalResult);

    if (errors.length) {
      next(new InternalError(errors, true));
    }
  } catch (e) {
    next(new InternalError(e));
  }
};

/**
 * Delete images
 */

export const deleteImage = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      next(new NotFound());

      return;
    }

    const itemToDelete = book.images.find(
      (item) => item._id.equals(req.params.imageId)
    );

    if (!itemToDelete) {
      next(new NotFound());

      return;
    }

    await removeFile(itemToDelete.url, buckets.DEFAULT);
    await Book.findByIdAndUpdate(
      req.params.bookId,
      {
        $pull: {
          images: {
            _id: itemToDelete._id
          },
        }
      },
    );

    res.sendStatus(204);
  } catch (e) {
    next(new InternalError(e));
  }
};