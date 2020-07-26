const log = require('../logger');

let exportable = {
    wrap: async (requestUrl, processFunction) => {
        return processFunction();
    }
};

if (process.argv.indexOf('--use-redis') >= 0) {
    log.info("NOTE: --use-redis flag detected, trying to start redis client.");
    const config = require('config');
    const client = require('redis').createClient(config.get('hosts.redis'));

    client.on("error", function (error) {
        log.info(error);
    });

    client.on("connect", function () {
        log.info("Connected to redis.");
        exportable.wrap = async (requestUrl, processFunction, ttl = 60) => {
            return new Promise((res, rej) => {
                client.get(requestUrl, (err, data) => {
                    if (err || data === null) {
                        processFunction().then(innerData => {
                            client.set(requestUrl, innerData, 'EX', ttl)
                            res(innerData);
                        }).catch(rej);
                    } else {
                        res(data);
                        processFunction().then(innerData => {
                            client.set(requestUrl, innerData, 'EX', ttl)
                        }).catch(rej);
                    }
                });
            });
        }
    });
}

module.exports = exportable;
