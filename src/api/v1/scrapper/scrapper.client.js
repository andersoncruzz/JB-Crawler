const axios = require('../../../axios').request();
const cache = require('../../../redis');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();


const navigate = async (url) => cache.wrap(url, () => {
    return axios.get(url, {
        jar: cookieJar,
        withCredentials: true,
    }).then(({data}) => data);
});


module.exports = {
    navigate,
}
