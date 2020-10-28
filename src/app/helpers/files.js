import Cuid from 'cuid';
import Mime from 'mime-types';

import fileService from '../config/file_upload';

/**
 * Uploads one file.
 *
 * @param {String} content
 * @param {String} bucket
 */

export const uploadFile = async (content, bucket) => {
  const buffer = content.buffer;
  const extension = Mime.extension(content.mimetype);
	const fileName = `${Cuid()}.${extension}`;

	const result = await fileService.storeFile(bucket, fileName, buffer);

	const item = {
		...result,
    url: fileService.getPublicURL(bucket, fileName),
    name: content.originalname,
	};

	return item;
};

/**
 * Removes a file.
 *
 * @param {String} url
 * @param {String} bucket
 */

export const removeFile = async (url, bucket) => {
	const name = url.split('/').pop();
	
  await fileService.removeFile(bucket, name);
  
	return true;
};
