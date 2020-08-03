const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
const axios = require('../../../axios').request();
const cache = require('../../../redis');
const log = require('../../../logger');

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();

const navigate = async (url) => cache.wrap(url, () => axios.get(url, {
  jar: cookieJar,
  withCredentials: true,
}).then(({ data }) => data).catch((err) => {
  log.error(err.message);
  throw new Error(err);
}));

module.exports = {
  navigate,
};
