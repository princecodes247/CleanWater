const axios = require ('axios');
const dotenv = require("dotenv")

dotenv.config()


  async function getAuthCode (code) {
      try {
          const { data } = await axios({
              url: `https://oauth2.googleapis.com/token`,
              method: 'post',
              data: {
                  client_id: process.env.CLIENT_ID,
                  client_secret: process.env.CLIENT_SECRET,
                  redirect_uri: 'http://localhost:5000/home',
                  grant_type: 'authorization_code',
                  code,
              },
          });
          console.log(data); // { access_token, expires_in, token_type, refresh_token }
          return data.access_token;
      }
      catch {
          console.log("Access token couldn't be secured")
      }
};
  
module.exports = getAuthCode
