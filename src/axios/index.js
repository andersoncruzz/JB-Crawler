const axios = require('axios');
const https = require('https');
const axios_reties = require('axios-retry');

const request = (timeout = 15000) => {
  const client = axios.create({
    timeout,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });
  axios_reties(client, { retries: 5 });
  return client;
};

const convertError = (error) => {
  if (!error.response) {
    return error;
  }
  if (!error.response.data) {
    return error.response;
  }
  return error.response.data.message || error.response.data;
};

module.exports = {
  request,
  convertError,
};
