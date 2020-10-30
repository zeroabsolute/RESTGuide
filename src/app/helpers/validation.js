export const allowedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
export const allowedDocTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
export const allowedFileTypes = [...allowedDocTypes, ...allowedImageTypes];

/**
 * Regex-es.
 */

export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[?!@#$%^&*])[0-9a-zA-Z?!@#$%^&*]{6,}$/;
export const phoneRegex = /^[0-9+]{10,}$/;
export const commaSeparatedWords = /^([A-Za-z0-9]+)(,\s*[A-Za-z0-9]+)*$/;
export const imageBase64Regex = new RegExp(`data:(${allowedImageTypes.join('|')});base64,([^\"]*)`);
export const fileBase64Regex = new RegExp(`data:(${allowedFileTypes.join('|')});base64,([^\"]*)`);