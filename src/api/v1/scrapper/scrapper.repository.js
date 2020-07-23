const client = require('./scrapper.client');
const log = require('../../../logger');
const Sanitizer = require('string-sanitizer');
const {findStateFromTRCode} = require('../../../domain/courttype');

async function find(processId) {
    const state = findStateFromTRCode(processId);
    const sanitizedProcessId = Sanitizer.sanitize(processId);
    const firstInstancePage = await client.navigate(state.instances.first.url(sanitizedProcessId));
    return firstInstancePage;
}

module.exports = {
    find,
}
