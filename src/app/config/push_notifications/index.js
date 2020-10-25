import WebPush from 'web-push';

import config from '../var';

WebPush.setVapidDetails(
  `mailto:${config.mailServiceSender}`,
  config.vapidPublicKey,
  config.vapidPrivateKey
);

export const sendPushNotification = (title, message, subscription) => {
  return WebPush.sendNotification(
    subscription, 
    JSON.stringify({
      title,
      message,
    }),
  );
};


export default WebPush;
