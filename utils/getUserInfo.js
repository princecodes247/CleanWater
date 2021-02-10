const axios = require ('axios');

async function getInfo(access_token) {
  try {
    const { data } = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return data;
  }
  catch {
    console.log("User information could not be retrieved")
  }
};

module.exports =  getInfo