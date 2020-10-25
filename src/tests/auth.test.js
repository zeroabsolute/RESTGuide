import Chai from 'chai';
import ChaiHTTP from 'chai-http';
import Sinon from 'sinon';
import Bcrypt from 'bcryptjs';
import Crypto from 'crypto';
import Faker from 'faker';

import server from '../index';
import User from '../app/models/user';
import { createToken } from '../app/config/authentication/jwt';
import { generateToken } from '../app/config/authentication/two_factor_auth';
import errors from '../app/constants/errors';
import mailService from '../app/config/mail';

Chai.use(ChaiHTTP);

describe(`Test "Auth" endpoints`, () => {
  const email = Faker.internet.email();
  let confirmationToken = null;
  const password = 'Ran@0m?pass';
  let userToken = null;
  let twoStepAuthSecretKey = null;
  let sendEmailStub = null;

  before(async () => {
    await User.deleteMany({});
    sendEmailStub = Sinon.stub(mailService, 'sendEmail').resolves();
  });

  /**
   * Endpoint: "POST /auth/registration"
   */

  it('Test "POST /auth/registration" (Success test case)', async () => {
    const body = {
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email,
      password,
      redirectUrl: Faker.internet.url(),
    };
    const response = await Chai.request(server)
      .post('/api/v1/auth/registration')
      .send(body);

    Chai.expect(response.status).to.equal(204);
  });

  it('Test "POST /auth/registration" (Fail test case: Duplicate emails)', async () => {
    const body = {
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email,
      password,
      redirectUrl: Faker.internet.url(),
    };
    const response = await Chai.request(server)
      .post('/api/v1/auth/registration')
      .send(body);

    Chai.expect(response.status).to.equal(422);
    Chai.expect(response.body.details).to.equal(errors.DUPLICATE_EMAILS);
  });

  /**
   * Endpoint: "POST /auth/resend-confirmation-email"
   */

  it('Test "POST /auth/resend-confirmation-email" (Fail test case: No results found)', async () => {
    const body = {
      email: 'not@found.com',
      redirectUrl: Faker.internet.url(),
    };
    const response = await Chai.request(server)
      .post(`/api/v1/auth/resend-confirmation-email`)
      .send(body);

    Chai.expect(response.status).to.equal(404);
    Chai.expect(response.body.details).to.equal(errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED);
  });

  it('Test "POST /auth/resend-confirmation-email" (Success test case)', async () => {
    const body = {
      email,
      redirectUrl: Faker.internet.url(),
    };
    const response = await Chai.request(server)
      .post(`/api/v1/auth/resend-confirmation-email`)
      .send(body);

    Chai.expect(response.status).to.equal(204);
  });

  /**
   * Endpoint: "POST /auth/login"
   */

  it('Test "POST /auth/login" (Fail test case: Account not confirmed)', async () => {
    const body = {
      email,
      password,
    };
    const response = await Chai.request(server)
      .post('/api/v1/auth/login')
      .send(body);

    Chai.expect(response.status).to.equal(401);
    Chai.expect(response.body.details).to.equal(errors.ACCOUNT_NOT_CONFIRMED);
  });

  /**
   * Endpoint: "PUT /auth/confirmation"
   */

  it('Test "PUT /auth/confirmation" (Success test case)', async () => {
    const user = await User.findOne({ email: email.toLowerCase() });

    confirmationToken = user.confirmationToken;

    const response = await Chai.request(server)
      .put(`/api/v1/auth/confirmation?token=${confirmationToken}`);

    Chai.expect(response.status).to.equal(204);
  });

  it('Test "PUT /auth/confirmation" (Fail test case: No results found)', async () => {
    const response = await Chai.request(server)
      .put(`/api/v1/auth/confirmation?token=${confirmationToken}`);

    Chai.expect(response.status).to.equal(404);
    Chai.expect(response.body.details).to.equal(errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED);
  });

  /**
   * Endpoint: "POST /auth/login"
   */

  it('Test "POST /auth/login" (Fail test case: Email not found)', async () => {
    const body = {
      email: Faker.internet.email(),
      password,
    };
    const response = await Chai.request(server)
      .post('/api/v1/auth/login')
      .send(body);

    Chai.expect(response.status).to.equal(401);
    Chai.expect(response.body.details).to.equal(errors.USER_NOT_FOUND);
  });

  it('Test "POST /auth/login" (Fail test case: Invalid password)', async () => {
    const body = {
      email,
      password: 'Invalid',
    };
    const response = await Chai.request(server)
      .post('/api/v1/auth/login')
      .send(body);

    Chai.expect(response.status).to.equal(401);
    Chai.expect(response.body.details).to.equal(errors.INVALID_PASSWORD);
  });

  it('Test "POST /auth/login" (Success test case)', async () => {
    const body = {
      email,
      password,
    };
    const response = await Chai.request(server)
      .post('/api/v1/auth/login')
      .send(body);

    const token = createToken(response.body);

    Chai.expect(response.status).to.equal(200);
    Chai.expect(response.body).to.have.all.keys(
      '__v',
      '_id',
      'firstName',
      'lastName',
      'email',
      'isAdmin',
      'twoFactorAuth',
      'confirmationLevel',
      'confirmationToken',
      'createdAt',
      'updatedAt',
      'token',
    );
    Chai.expect(response.body.token).to.equal(token);

    userToken = `Bearer ${response.body.token}`;
  });

  /**
   * Endpoint: "POST /auth/request-new-password"
   */

  it('Test "POST /auth/request-new-password" (Fail test case: User not found)', async () => {
    const body = {
      email: 'not.found@example.com',
      redirectUrl: Faker.internet.url(),
    };
    const response = await Chai.request(server)
      .post(`/api/v1/auth/request-new-password`)
      .send(body);

    Chai.expect(response.status).to.equal(404);
    Chai.expect(response.body.details).to.equal(errors.USER_NOT_FOUND);
  });

  it('Test "POST /auth/request-new-password" (Success test case)', async () => {
    const body = {
      email,
      redirectUrl: Faker.internet.url(),
    };
    const response = await Chai.request(server)
      .post(`/api/v1/auth/request-new-password`)
      .send(body);

    Chai.expect(response.status).to.equal(204);
  });

  /**
   * Endpoint: "PUT /auth/password"
   */

  it('Test "PUT /auth/password" (Fail test case: User not found)', async () => {
    const body = {
      token: Crypto.randomBytes(32).toString('hex'),
      password: 'Ran@0m?pass2',
    };
    const response = await Chai.request(server)
      .put(`/api/v1/auth/password`)
      .send(body);

    Chai.expect(response.status).to.equal(404);
    Chai.expect(response.body.details).to.equal(errors.USER_NOT_FOUND);
  });

  it('Test "PUT /auth/password" (Success test case)', async () => {
    const user = await User.findOne({ email: email.toLowerCase() });
    const body = {
      token: user.confirmationToken,
      password: 'Ran@0m?pass2',
    };
    const response = await Chai.request(server)
      .put(`/api/v1/auth/password`)
      .send(body);

    Chai.expect(response.status).to.equal(204);

    const updatedUser = await User.findOne({ email: email.toLowerCase() });
    const passwordsMatch = Bcrypt.compareSync(body.password, updatedUser.password);

    Chai.expect(passwordsMatch).to.equal(true);
  });

  /**
   * Endpoint: "PUT /auth/two-factor-auth/initialization"
   */

  it('Test "PUT /auth/two-factor-auth/initialization" (Success test case)', async () => {
    const response = await Chai.request(server)
      .put(`/api/v1/auth/two-factor-auth/initialization`)
      .set('authorization', userToken);

    Chai.expect(response.status).to.equal(200);
    Chai.expect(response.text).to.be.a('string');

    const user = await User.findOne({ email: email.toLowerCase() });

    Chai.expect(user.twoFactorAuth).to.be.an('object');

    twoStepAuthSecretKey = user.twoFactorAuth.secret;
  });

  /**
   * Endpoint: "PUT /auth/two-factor-auth/activation"
   */

  it('Test "PUT /auth/two-factor-auth/activation" (Success test case)', async () => {
    const response = await Chai.request(server)
      .put(`/api/v1/auth/two-factor-auth/activation`)
      .set('authorization', userToken)
      .send({ token: generateToken(twoStepAuthSecretKey) });

    Chai.expect(response.status).to.equal(204);

    const updatedUser = await User.findOne({ email: email.toLowerCase() });

    Chai.expect(updatedUser.twoFactorAuth.active).to.equal(true);
    Chai.expect(updatedUser.twoFactorAuth.secret).to.be.an('object');
  });

  /**
   * Endpoint: "HEAD /auth/two-factor-auth/verification"
   */

  it('Test "HEAD /auth/two-factor-auth/verification" (Success test case)', async () => {
    const response = await Chai.request(server)
      .head(`/api/v1/auth/two-factor-auth/verification?token=${generateToken(twoStepAuthSecretKey)}`)
      .set('authorization', userToken);

    Chai.expect(response.status).to.equal(200);
  });

  after(async () => {
    await User.deleteMany({});
    sendEmailStub.restore();
  });
});
