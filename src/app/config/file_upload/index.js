import Multer from 'multer';
import { allowedImageTypes } from '../../constants/validation';

import config from '../var';
import * as minioDriver from './minio';

let fileUploadService = minioDriver;

switch (config.fileUploadService) {
  case 'minio':
    fileUploadService = minioDriver;
    break;
  default:
    fileUploadService = minioDriver;
    break;
}

export default fileUploadService;

export const multerConfigForMemoryStorage = {
  storage: Multer.memoryStorage(),
  limits: {
    fieldSize: 500000,
    fileSize: 500000,
  },
  fileFilter: (_req, file, cb) => {
    if (allowedImageTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(null, false);
  },
};
