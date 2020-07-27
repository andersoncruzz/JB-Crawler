const cheerio = require('cheerio');
const Sanitizer = require('string-sanitizer');
const client = require('./scrapper.client');
const { findStateFromTRCode } = require('../../../domain/courttype');

async function find(processId) {
  const state = findStateFromTRCode(processId);
  const sanitizedProcessId = Sanitizer.sanitize(processId);

  const firstInstancePage = await client.navigate(state.instances.first.url(sanitizedProcessId));
  const firstInstanceParsedPage = cheerio.load(firstInstancePage);

  const response = {
    primeiraInstancia: state.instances.first.parser(firstInstanceParsedPage),
  };

  return response;
}

module.exports = {
  find,
};
