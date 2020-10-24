import Ejs from 'ejs';
import Path from 'path';
import InlineCss from 'inline-css';

import { getRedirectUrl } from '../../helpers/url_utils';
import mailService from '../../config/mail';

export const sendConfirmationEmail = async (user, redirectUrl) => {
  const confirmationURL = getRedirectUrl(redirectUrl, `token=${user.confirmationToken}`);
  const name = user.firstName;
  const emailContent = await Ejs.renderFile(
    Path.resolve(
      __dirname,
      '../../../templates/mail/account_confirmation.ejs'
    ),
    {
      user: name || '',
      confirmationLink: confirmationURL
    }
  );
  const html = await InlineCss(emailContent, {
    url: ' ',
    applyStyleTags: true
  });

  await mailService.sendEmail({
    to: user.email,
    subject: 'Account Confirmation',
    html,
  });
};

export const sendEmailWithResetPasswordLink = async (user, redirectUrl) => {
  const emailContent = await Ejs.renderFile(
    Path.resolve(
      __dirname,
      '../../../templates/mail/reset_password_instructions.ejs'
    ),
    {
      user: user.firstName,
      resetPasswordUrl: getRedirectUrl(redirectUrl, `token=${user.confirmationToken}`),
    }
  );

  const html = await InlineCss(emailContent, {
    url: ' ',
    applyStyleTags: true
  });

  await mailService.sendEmail({
    to: user.email,
    subject: 'Reset Password Instructions',
    html,
  });
};
