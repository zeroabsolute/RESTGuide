import config from '../var';

import * as sendgridDriver from './sendgrid';

let mailService = null;

switch (config.mailService) {
  case 'sendgrid':
    mailService = sendgridDriver;
    break;
  default:
    mailService = sendgridDriver;
    break;
}

export default mailService;