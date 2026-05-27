const axios = require('axios');
const https = require("https");

function updateProcess(data) {
  console.log("in api file", data)
  console.log("process.env.AUTH_SECRET_KEY")

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // <--- bypass certificate validation
  });

  const config = {
    method: 'patch',
    url: `${process.env.BACKEND_URL}/response/video-reformat`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'ENGINE_SECRET',
    },
    data: JSON.stringify(data),
    httpsAgent
  };
  return axios(config);
}

module.exports = {
  updateProcess,
};