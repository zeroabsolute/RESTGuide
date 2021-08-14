import Chai from 'chai';
import ChaiHTTP from 'chai-http';
import Crypto from 'crypto';
import Faker from 'faker';

import server from '../index';
import User from '../app/modules/auth/user.model';
import Author from '../app/models/author';
import { createToken } from '../app/config/authentication/jwt';
import errors from '../app/constants/errors';
import confirmationLevels from '../app/constants/confirmation_levels';

Chai.use(ChaiHTTP);

describe(`Test "Authors" endpoints`, () => {
  let userToken = null;
  let adminToken = null;
  let createdAuthor = null;
  let createdUser = null;
  const firstName = Faker.name.firstName();
  const otherFirstName = Faker.name.firstName();
  const lastName = Faker.name.lastName();
  const genres = [Faker.random.word(), Faker.random.word()];

  before(async () => {
    await User.deleteMany({});
    await Author.deleteMany({});

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
      firstName: otherFirstName,
      lastName,
      genres: [Faker.random.word()],
    });

    await author.save();
  });

  /**
   * Endpoint: "POST /authors"
   */

  it('Test "POST /authors" (Fail test case: Not authorized)', async () => {
    const body = {
      firstName,
      lastName,
      genres,
    };
    const response = await Chai.request(server)
      .post('/api/v1/authors')
      .set('authorization', userToken)
      .send(body);

    Chai.expect(response.status).to.equal(403);
  });

  it('Test "POST /authors" (Success test case)', async () => {
    const body = {
      firstName,
      lastName,
      genres,
    };
    const response = await Chai.request(server)
      .post('/api/v1/authors')
      .set('authorization', adminToken)
      .send(body);

    Chai.expect(response.status).to.equal(201);
    Chai.expect(response.body).to.have.all.keys(
      '__v',
      '_id',
      'firstName',
      'lastName',
      'genres',
      'createdAt',
      'updatedAt',
    );

    createdAuthor = response.body;
  });

  it('Test "POST /authors" (Fail test case: Duplicate names)', async () => {
    const body = {
      firstName,
      lastName,
      genres,
    };
    const response = await Chai.request(server)
      .post('/api/v1/authors')
      .set('authorization', adminToken)
      .send(body);

    Chai.expect(response.status).to.equal(422);
    Chai.expect(response.body.details).to.equal(errors.AUTHOR_EXISTS);
  });

  /**
   * Endpoint: "GET /authors"
   */

  it('Test "GET /authors" (Fail test case: Bad Request)', async () => {
    const response = await Chai.request(server)
      .get(`/api/v1/authors?fields=firstName,&genre=${genres[0]}`)
      .set('authorization', userToken);

    Chai.expect(response.status).to.equal(400);
  });

  it('Test "GET /authors" (Success test case: Projected response & filters applied)', async () => {
    const response = await Chai.request(server)
      .get(`/api/v1/authors?fields=firstName,lastName&genre=${genres[0]}`)
      .set('authorization', userToken);

    Chai.expect(response.status).to.equal(200);
    Chai.expect(response.body[0]).to.have.all.keys(
      '_id',
      'firstName',
      'lastName',
    );
  });

  /**
   * Endpoint: "GET /authors/:id"
   */

  it('Test "GET /authors/:id" (Fail test case: Not Found)', async () => {
    const response = await Chai.request(server)
      .get(`/api/v1/authors/${createdUser._id}`)
      .set('authorization', userToken);

    Chai.expect(response.status).to.equal(404);
  });

  it('Test "GET /authors/:id" (Success test case)', async () => {
    const response = await Chai.request(server)
      .get(`/api/v1/authors/${createdAuthor._id}`)
      .set('authorization', userToken);

    Chai.expect(response.status).to.equal(200);
    Chai.expect(response.body).to.have.all.keys(
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
   * Endpoint: "PATCH /authors/:id"
   */

  it('Test "PATCH /authors/:id" (Fail test case: Not Found)', async () => {
    const response = await Chai.request(server)
      .patch(`/api/v1/authors/${createdUser._id}`)
      .set('authorization', adminToken);

    Chai.expect(response.status).to.equal(404);
  });

  it('Test "PATCH /authors/:id" (Fail test case: Author exists)', async () => {
    const response = await Chai.request(server)
      .patch(`/api/v1/authors/${createdAuthor._id}`)
      .set('authorization', adminToken)
      .send({ firstName: otherFirstName });

    Chai.expect(response.status).to.equal(422);
    Chai.expect(response.body.details).to.equal(errors.AUTHOR_EXISTS);
  });

  it('Test "PATCH /authors/:id" (Success test case)', async () => {
    const newFirstName = Faker.name.firstName();
    const response = await Chai.request(server)
      .patch(`/api/v1/authors/${createdAuthor._id}`)
      .set('authorization', adminToken)
      .send({ firstName: newFirstName });
    const updatedAuthor = await Author.findById(createdAuthor._id);

    Chai.expect(response.status).to.equal(204);
    Chai.expect(updatedAuthor.toJSON().firstName).to.equal(newFirstName);
  });

  /**
   * Endpoint: "DELETE /authors/:id"
   */

  it('Test "DELETE /authors/:id" (Success test case)', async () => {
    const response = await Chai.request(server)
      .delete(`/api/v1/authors/${createdAuthor._id}`)
      .set('authorization', adminToken);

    Chai.expect(response.status).to.equal(204);
  });

  it('Test "DELETE /authors/:id" (Fail test case: Not Found)', async () => {
    const response = await Chai.request(server)
      .delete(`/api/v1/authors/${createdAuthor._id}`)
      .set('authorization', adminToken);

    Chai.expect(response.status).to.equal(404);
  });

  after(async () => {
    await User.deleteMany({});
    await Author.deleteMany({});
  });
});
