const axios = require("axios");
const https = require("https");
const { getBackendUrl, isDevEnv } = require("../utils/environment");

function updateProcess(data) {
  console.log("in api file", data);
  console.log("in api getBackendUrl", getBackendUrl());
  console.log("in api isDevEnv", isDevEnv());

  const config = {
    method: "patch",
    url: `${getBackendUrl()}/response/video-reformat`,
    headers: {
      "Content-Type": "application/json",
      Authorization: 'ENGINE_SECRET',
    },
    data: JSON.stringify(data),
  };

  if (isDevEnv()) {
    config.httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
  }

  return axios(config);
}

module.exports = {
  updateProcess,
};