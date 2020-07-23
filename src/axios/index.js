const axios = require('axios');
const axios_reties = require('axios-retry');

const request = (timeout = 5000) => {
    const client = axios.create({
        timeout,
    });
    axios_reties(client, {retries: 3});
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
