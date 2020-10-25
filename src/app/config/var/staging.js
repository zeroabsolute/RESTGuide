export default {
  port: process.env.PORT || 5000,
  appName: 'rest-guide',
  databaseUrl: '',
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  apiDocsUsername: process.env.API_DOCS_USERNAME,
  apiDocsPassword: process.env.PASSWORD,
  mailService: 'sendgrid',
  mailServiceApiKey: process.env.MAIL_SERVICE_API_KEY,
  mailServiceSender: process.env.MAIL_SERVICE_SENDER,
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
};
