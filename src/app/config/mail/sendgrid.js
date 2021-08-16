import Sendgrid from '@sendgrid/mail';

import config from '../var';

Sendgrid.setApiKey(config.mailServiceApiKey);

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
        email: params.from || config.mailServiceSender,
        name: config.appName
      },
    };

    if (params.attachments) {
      body.attachments = params.attachments;
    }

    Sendgrid.send(body, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};