import config from '../var';

const Minio = require('minio');
let service = null;

/**
 * Minio config.
 */

const fileUploadServiceConfig = {
  endPoint: config.fileUploadServiceUrl,
  useSSL: false,
  port: config.fileUploadServicePort ? parseInt(config.fileUploadServicePort, 10) : 9000,
  accessKey: config.fileUploadServiceAccessKey,
  secretKey: config.fileUploadServiceSecretKey,
};

/**
 * Initializes the file uploader service.
 */

export function initFileUploadService() {
  service = new Minio.Client(fileUploadServiceConfig);
}

/**
 * Creates a new bucket if there is no other bucket with the 
 * same name.
 */

export function createBucket(name) {
  return new Promise((resolve, reject) => {
    service.bucketExists(name, (error, exists) => {
      if (error) {
        reject(error);
      }

      if (exists) {
        resolve();
      } else {
        service.makeBucket(name, 'us-east-1', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
}

/**
 * Stores an object in a given bucket.
 */

export function storeFile(bucketName, fileName, buffer) {
  return new Promise((resolve, reject) => {
    service.putObject(bucketName, fileName, buffer, (error, etag) => {
      if (error) {
        reject(error);
      } else {
        resolve(etag);
      }
    });
  });
}

/**
 * Download a file.
 * Name and bucket are required.
 */

export function getFile(bucketName, fileName) {
  return new Promise((resolve, reject) => {
    service.getObject(bucketName, fileName, (error, stream) => {
      if (error) {
        reject(error);
      }
      
      resolve(stream);
    });
  });
}

/**
 * Deletes an object from a given bucket.
 */

export function removeFile(bucketName, fileName) {
  return new Promise((resolve, reject) => {
    service.removeObject(bucketName, fileName, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Return the public URL for a given file
 */

export function getPublicURL(bucketName, fileName) {
  return `${config.FILE_UPLOAD_SERVICE_EXTERNAL_URL}/${bucketName}/${fileName}`;
}

export function getService () { 
  return service; 
}