import { expect } from 'chai';

import * as tfa from './two_factor_auth';

describe(`Test 2FA`, () => {
  let sampleSecretKey = null;
  let sampleTokenFromGoogleAuthenticator = null;

  before(() => {
    sampleSecretKey = {
      ascii: 'UTv>gW?6?x/J77>6}eaI60tZR!{ao<0$',
      hex: '5554763e67573f363f782f4a37373e367d6561493630745a52217b616f3c3024',
      base32: 'KVKHMPTHK47TMP3YF5FDONZ6GZ6WKYKJGYYHIWSSEF5WC3Z4GASA',
      otpauth_url: 'otpauth://totp/SecretKey?secret=KVKHMPTHK47TMP3YF5FDONZ6GZ6WKYKJGYYHIWSSEF5WC3Z4GASA'
    };

    sampleTokenFromGoogleAuthenticator = '992230';
  });

  it('Check secret key generation', () => {
    const result = tfa.generateSecret();
    
    expect(result).to.have.property('base32');
    expect(result).to.have.property('otpauth_url');
  });

  it('Check QR Code generation', async () => {
    const codeBase64 = await tfa.generateQRCode(sampleSecretKey);

    expect(codeBase64).to.be.a('string');
  });

  it('Check token validation', () => {
    const result = tfa.validateToken(sampleSecretKey, sampleTokenFromGoogleAuthenticator);

    expect(result).to.equal(false);
  });
});