import Chai from 'chai';
import ChaiHTTP from 'chai-http';

import server from '../app/app';

Chai.use(ChaiHTTP);

describe(`Test "Health" endpoint`, function () {

  /**
   * Endpoint: "GET /health"
   */

  it('Test "GET /health" (Success test case)', async () => {
    const response = await Chai.request(server)
      .get('/api/v1/health');

    Chai.expect(response.status).to.equal(200);
    Chai.expect(response.body).to.have.all.keys(
      'appName',
      'version',
      'status',
    );
  });
});