const axios = require('axios');

const sendNotification = async ({ token, title, body }) => {
  const accessToken = process.env.FCM_ACCESS_TOKEN;
  const projectId = process.env.FCM_PROJECT_ID;

  const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

  const messagePayload = {
    message: {
      token,
      notification: {
        title,
        body
      }
    }
  };

  const response = await axios.post(url, messagePayload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

module.exports = { sendNotification };
