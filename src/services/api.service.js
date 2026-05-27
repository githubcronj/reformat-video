const axios = require('axios');

function updateProcess(data) {
  console.log("in api file", data)
  const config = {
    method: 'patch',
    url: `${process.env.BACKEND_URL}/response/video-reformat`, 
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.AUTH_SECRET_KEY,
    },
    data: JSON.stringify(data),
  };
  return axios(config);
}

module.exports = {
  updateProcess,
};