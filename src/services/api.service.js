const axios = require('axios');

function updateProcess(data) {
  console.log("in api file", data)
  const config = {
    method: 'patch',
    url: `${process.env.BACKEND_URL}/response/video-processing-update`, // name change 
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'ENGINE_SECRET', // keep in env
    },
    data: JSON.stringify(data),
  };
  return axios(config);
}

module.exports = {
  updateProcess,
};