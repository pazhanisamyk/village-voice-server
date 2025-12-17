const { GoogleAuth } = require('google-auth-library');

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: './serviceAccountKey.json', // path to your service account JSON
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  });

  const client = await auth.getClient();
  const accessTokenResponse = await client.getAccessToken();
  return accessTokenResponse.token;
}

module.exports = { getAccessToken };
