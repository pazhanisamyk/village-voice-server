const axios = require('axios');
const { getAccessToken } = require('../getFcmAccessToken');

const sendNotification = async ({ token, title, body, complaintId, image }) => {
  const accessToken = await getAccessToken();
  const projectId = process.env.FCM_PROJECT_ID;

  const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

  const messagePayload = {
    message: {
      token,
      notification: {
        title,
        body
      },
      android: {
        notification: {
          image
        }
      },
      data: {
        complaintId,
        image
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
