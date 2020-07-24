const log = require('../logger');

let wrap = async (requestUrl, processFunction) => {
    return processFunction();
}

if (process.argv.indexOf('--use-redis') >= 0) {
    const config = require('config');
    const client = require('redis').createClient(config.get('hosts.redis'));

    client.on("error", function (error) {
        log.info(error);
    });

    client.on("connect", function () {
        log.info("Connected to redis.");
        wrap = async (requestUrl, processFunction, ttl = 60) => {
            return new Promise((res, rej) => {
                client.get(requestUrl, (err, data) => {
                    if (err || data === null) {
                        processFunction().then(innerData => {
                            client.set(requestUrl, innerData, 'EX', ttl * 60)
                            res(data);
                        }).catch(rej);
                    } else {
                        res(data);
                        processFunction().then(innerData => {
                            client.set(requestUrl, innerData, 'EX', ttl * 60)
                        }).catch(rej);
                    }
                });
            });
        }
    });
}

module.exports = {
    wrap,
}
