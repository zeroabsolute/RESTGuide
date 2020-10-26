import Chai from 'chai';
import ChaiHTTP from 'chai-http';
import Crypto from 'crypto';
import Faker from 'faker';

import server from '../index';
import User from '../app/models/user';
import Author from '../app/models/author';
import Book from '../app/models/book';
import { createToken } from '../app/config/authentication/jwt';
import confirmationLevels from '../app/constants/confirmation_levels';

Chai.use(ChaiHTTP);

describe(`Test "Books" endpoints`, () => {
  let userToken = null;
  let adminToken = null;
  let createdBook = null;
  let createdUser = null;
  let createdAuthor = null;
  const genre = Faker.random.word();

  before(async () => {
    await User.deleteMany({});
    await Author.deleteMany({});
    await Book.deleteMany({});

    const user = new User({
			firstName: Faker.name.firstName(),
			lastName: Faker.name.lastName(),
			email: Faker.internet.email().toLowerCase(),
			password: Faker.internet.password(),
			confirmationLevel: confirmationLevels.CONFIRMED,
      confirmationToken: Crypto.randomBytes(32).toString('hex'),
      twoFactorAuth: { active: true },
			isAdmin: false
		});
		const admin = new User({
			firstName: Faker.name.firstName(),
			lastName: Faker.name.lastName(),
			email: Faker.internet.email().toLowerCase(),
			password: Faker.internet.password(),
			confirmationLevel: confirmationLevels.CONFIRMED,
			confirmationToken: Crypto.randomBytes(32).toString('hex'),
      twoFactorAuth: { active: true },
			isAdmin: true
    });
    
    await admin.save();
    createdUser = await user.save();
		userToken = `Bearer ${createToken(user)}`;
    adminToken = `Bearer ${createToken(admin)}`;
    
    const author = new Author({
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      genres: [Faker.random.word()],
    });

    createdAuthor = await author.save();
  });

  /**
   * Endpoint: "POST /books"
   */

  it('Test "POST /books" (Fail test case: Not authorized)', async () => {
    const body = {
      title: Faker.random.words(),
      author: createdAuthor._id,
      pages: Faker.random.number(),
      genre: Faker.random.word(),
      publications: ['2020-10-26', '2010-10-26']
    };
    const response = await Chai.request(server)
      .post('/api/v1/books')
      .set('authorization', userToken)
      .send(body);

    Chai.expect(response.status).to.equal(403);
  });

  it('Test "POST /books" (Success test case)', async () => {
    const body = {
      title: Faker.random.words(),
      author: createdAuthor._id,
      pages: Faker.random.number(),
      genre,
      publications: ['2020-10-26', '2010-10-26']
    };
    const response = await Chai.request(server)
      .post('/api/v1/books')
      .set('authorization', adminToken)
      .send(body);

    Chai.expect(response.status).to.equal(201);
    Chai.expect(response.body).to.have.all.keys(
      '__v',
      '_id',
      'title',
      'author',
      'pages',
      'genre',
      'publications',
      'images',
      'createdAt',
      'updatedAt',
    );

    createdBook = response.body;
  });

  /**
   * Endpoint: "GET /books"
   */

  it('Test "GET /books" (Fail test case: Bad Request)', async () => {
    const response = await Chai.request(server)
      .get(`/api/v1/books?fields=title,&genre=${genre}`)
      .set('authorization', userToken);

    Chai.expect(response.status).to.equal(400);
  });

  it('Test "GET /books" (Success test case: Projected response & filters applied)', async () => {
    const response = await Chai.request(server)
      .get(`/api/v1/books?fields=title,pages,genre&genre=${genre.substr(1, 2)}`)
      .set('authorization', userToken);

    Chai.expect(response.status).to.equal(200);
    Chai.expect(response.body[0]).to.have.all.keys(
      '_id',
      'title',
      'genre',
      'pages',
    );
  });

  /**
   * Endpoint: "GET /books/:id"
   */

  it('Test "GET /books/:id" (Fail test case: Not Found)', async () => {
    const response = await Chai.request(server)
      .get(`/api/v1/books/${createdUser._id}`)
      .set('authorization', userToken);

    Chai.expect(response.status).to.equal(404);
  });

  it('Test "GET /books/:id" (Success test case)', async () => {
    const response = await Chai.request(server)
      .get(`/api/v1/books/${createdBook._id}`)
      .set('authorization', userToken);

    Chai.expect(response.status).to.equal(200);
    Chai.expect(response.body).to.have.all.keys(
      '__v',
      '_id',
      'title',
      'author',
      'pages',
      'genre',
      'publications',
      'images',
      'createdAt',
      'updatedAt',
    );
    Chai.expect(response.body.author).to.have.all.keys(
      '__v',
      '_id',
      'firstName',
      'lastName',
      'genres',
      'createdAt',
      'updatedAt',
    );
  });

  /**
   * Endpoint: "PATCH /books/:id"
   */

  it('Test "PATCH /books/:id" (Fail test case: Not Found)', async () => {
    const response = await Chai.request(server)
      .patch(`/api/v1/books/${createdUser._id}`)
      .set('authorization', adminToken)
      .send({ title: Faker.random.words() });

    Chai.expect(response.status).to.equal(404);
  });

  it('Test "PATCH /books/:id" (Success test case)', async () => {
    const newTitle = Faker.random.word();
    const response = await Chai.request(server)
      .patch(`/api/v1/books/${createdBook._id}`)
      .set('authorization', adminToken)
      .send({ title: newTitle });
    const updatedBook = await Book.findById(createdBook._id);

    Chai.expect(response.status).to.equal(204);
    Chai.expect(updatedBook.toJSON().title).to.equal(newTitle);
  });

  /**
   * Endpoint: "DELETE /books/:id"
   */

  it('Test "DELETE /books/:id" (Success test case)', async () => {
    const response = await Chai.request(server)
      .delete(`/api/v1/books/${createdBook._id}`)
      .set('authorization', adminToken);

    Chai.expect(response.status).to.equal(204);
  });

  it('Test "DELETE /books/:id" (Fail test case: Not Found)', async () => {
    const response = await Chai.request(server)
      .delete(`/api/v1/books/${createdBook._id}`)
      .set('authorization', adminToken);

    Chai.expect(response.status).to.equal(404);
  });

  after(async () => {
    await User.deleteMany({});
    await Author.deleteMany({});
    await Book.deleteMany({});
  });
});
