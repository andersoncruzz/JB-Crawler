const client = require('./scrapper.client');
const cheerio = require('cheerio');
const Sanitizer = require('string-sanitizer');
const {findStateFromTRCode} = require('../../../domain/courttype');

async function find(processId) {
    const state = findStateFromTRCode(processId);
    const sanitizedProcessId = Sanitizer.sanitize(processId);
    const firstInstancePage = await client.navigate(state.instances.first.url(sanitizedProcessId));
    const firstInstanceParsedPage = cheerio.load(firstInstancePage);
    return state.instances.first.parser(firstInstanceParsedPage);
}

module.exports = {
    find,
}
