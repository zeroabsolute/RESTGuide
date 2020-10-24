import SpeakEasy from 'speakeasy';
import QRCode from 'qrcode';

/**
 * Generates a unique secret key for each user.
 */

export const generateSecret = (userEmail) => {
  return SpeakEasy.generateSecret({ 
    length: 32,
    issuer: 'RESTGuide',
    name: `RESTGuide (${userEmail})`,
  });
};

/**
 * Generates a QR code.
 * 
 * @param {String} secret
 */

export const generateQRCode = (secret) => {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(secret.otpauth_url, (err, image_data) => {
      if (err) {
        reject(err);
      } else {
        resolve(image_data);
      }
    });
  });
};

/**
 * Generates a token from a secret key.
 * 
 * @param {String} secret
 */

export const generateToken = (secret) => {
  const token = SpeakEasy.totp({
    secret: secret.base32,
    encoding: 'base32',
  });

  return token;
};

/**
 * Verifies a given token.
 * 
 * @param {String} secret: User secret key stored on the db
 * @param {String} userToken: Token provided by the user request.
 */

export const validateToken = (secret, userToken) => {
  return SpeakEasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: userToken
  });
};