const log = require('../logger');

const exportable = {
  wrap: async (requestUrl, processFunction) => processFunction(),
};

if (process.argv.indexOf('--use-redis') >= 0) {
  log.info('NOTE: --use-redis flag detected, trying to start redis client.');
  const config = require('config');
  const client = require('redis').createClient(config.get('hosts.redis'));

  client.on('error', (error) => {
    log.info(error);
  });

  client.on('connect', () => {
    log.info('Connected to redis.');
    exportable.wrap = async (requestUrl, processFunction, ttl = config.get('redisTTL')) => new Promise((res, rej) => {
      client.get(requestUrl, (err, data) => {
        if (err || data === null) {
          processFunction().then((innerData) => {
            client.set(requestUrl, innerData, 'EX', ttl);
            res(innerData);
          }).catch(rej);
        } else {
          res(data);
          processFunction().then((innerData) => {
            client.set(requestUrl, innerData, 'EX', ttl);
          }).catch(rej);
        }
      });
    });
  });
}

module.exports = exportable;
