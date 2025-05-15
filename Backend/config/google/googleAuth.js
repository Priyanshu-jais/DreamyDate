const { OAuth2Client } = require('google-auth-library');

// Create clients for both Web and Android
const webClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID_WEB);
const androidClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID_ANDROID);

const verifyGoogleToken = async (token) => {
  try {
    let ticket;
    try {
      // Try web client first
      ticket = await webClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID_WEB,
      });
    } catch (error) {
      // If web verification fails, try Android client
      ticket = await androidClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID_ANDROID,
      });
    }
    
    return ticket.getPayload();
  } catch (error) {
    console.error("Google Token Verification Error:", error);
    throw error;
  }
};

module.exports = { verifyGoogleToken };
