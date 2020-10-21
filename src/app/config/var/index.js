import prodConfig from './production';
import stagingConfig from './staging';
import devConfig from './development';
import testConfig from './test';

let config = devConfig;

switch (process.env.NODE_ENV) {
  case 'development':
    config = devConfig;
    break;
  case 'production':
    config = prodConfig;
    break;
  case 'staging':
    config = stagingConfig;
    break;
  case 'test':
    config = testConfig;
    break;
  default:
    config = devConfig;
}

export default config;
