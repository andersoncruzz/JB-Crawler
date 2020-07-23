const axios = require('../../../axios').request();
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();


const navigate = async (url) => axios.get(url, {
    jar: cookieJar,
    withCredentials: true,
}).then(({data}) => data);

module.exports = {
    navigate,
}
