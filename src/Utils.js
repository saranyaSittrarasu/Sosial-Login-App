import axios from "axios";
export const getRefreshToken = async (codeResponse) => {
  let payload = {
    grant_type: "authorization_code",
    code: codeResponse.code,
    client_id: process.env.REACT_APP_CLIENT_ID_KEY,
    client_secret: process.env.REACT_APP_CLIENT_SECRET_KEY,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI_KEY,
  };
  try {
    const response = await axios.post(
      `https://oauth2.googleapis.com/token`,
      payload,
      {
        headers: {
          "Content-Type": "application/json;",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching refresh token:", error);
  }
};

export const getNewAccessToken = async (refreshToken) => {
  let payloadForAccessToken = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: process.env.REACT_APP_CLIENT_ID_KEY,
    client_secret: process.env.REACT_APP_CLIENT_SECRET_KEY,
  };

  try {
    const response = await axios.post(
      `https://oauth2.googleapis.com/token`,
      payloadForAccessToken,
      {
        headers: {
          "Content-Type": "application/json;",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching new access token:", error);
  }
};

export const getGoogleUserDetails = async (token) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching user details:", error);
  }
};
