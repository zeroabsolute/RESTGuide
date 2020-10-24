import Chai from 'chai';

import { getRedirectUrl } from './url_utils';

describe(`Test URL utility functions`, () => {
  const redirectUrlWithQueryParams = 'https://example.com?param1=value1';
  const redirectUrlWithoutQueryParams = 'https://example.com';
  const otherParams = "param2=value2";

	it('Test "Redirect URL" generator: Given URL has query params', () => {
    const output = getRedirectUrl(redirectUrlWithQueryParams, otherParams);

    Chai.expect(output).to.equal(`${redirectUrlWithQueryParams}&${otherParams}`);
  });
  
  it('Test "Redirect URL" generator: Given URL does not have query params', () => {
    const output = getRedirectUrl(redirectUrlWithoutQueryParams, otherParams);

    Chai.expect(output).to.equal(`${redirectUrlWithoutQueryParams}?${otherParams}`);
	});
  
  it(`Test "Redirect URL" generator: Given URL does not have query params, but has a "?" at the end`, () => {
    const output = getRedirectUrl(`${redirectUrlWithoutQueryParams}?`, otherParams);

    Chai.expect(output).to.equal(`${redirectUrlWithoutQueryParams}?${otherParams}`);
	});
});
