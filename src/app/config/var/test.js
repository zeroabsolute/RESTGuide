export default {
  port: process.env.PORT || 5000,
  appName: 'rest-guide',
  databaseUrl: 'mongodb://mongo1:27018,mongo2:27019,mongo3:27020/test?replicaSet=rs0',
  jwtSecretKey: '123467890',
  apiDocsUsername: 'username',
  apiDocsPassword: 'password',
};
