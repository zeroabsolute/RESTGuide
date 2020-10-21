const allowedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
const allowedDocTypes = [
  'application/pdf', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const allowedFileTypes = [...allowedDocTypes, ...allowedImageTypes];

/**
 * Regex-es.
 */

export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[?!@#$%^&*])[0-9a-zA-Z?!@#$%^&*]{6,}$/;
export const phoneRegex = /^[0-9+]{10,}$/;
export const imageBase64Regex = new RegExp(`data:(${allowedImageTypes.join('|')});base64,([^\"]*)`);
export const fileBase64Regex = new RegExp(`data:(${allowedFileTypes.join('|')});base64,([^\"]*)`);
