import Sendgrid from '@sendgrid/mail';

import errors from '../../constants/errors';
import config from '../var';

Sendgrid.setApiKey(config.MAIL_SERVICE_API_KEY);

/**
 * Creates and sends an email.
 * 
 * @param from
 * @param to
 * @param subject
 * @param html: Email content formatted as HTML
 * @param attachments: Attachments
 */

export const sendEmail = (params) => {
  return new Promise((resolve, reject) => {
    const body = {
      ...params,
      from: {
        email: params.from || config.MAIL_SERVICE_SENDER,
        name: config.APP_NAME
      },
    };

    if (params.attachments) {
      body.attachments = params.attachments;
    }

    Sendgrid.send(body, (error, info) => {
      if (error) {
        reject(errors.emailFailed(error));
      } else {
        resolve(info);
      }
    });
  });
}