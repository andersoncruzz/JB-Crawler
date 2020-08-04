const cheerio = require('cheerio');
const Sanitizer = require('string-sanitizer');
const _ = require('lodash');
const {InquiredDocumentNotFoundException} = require('../../../error/domain');
const client = require('./scrapper.client');
const {findStateFromTRCode} = require('./domain/courttype');
const log = require('../../../logger');

async function resolvePage(instance, processId, save = false) {
    const instancePage = await client.navigate(instance.url(processId));
    const parsedEntry = instance.parser(cheerio.load(instancePage));

    if (parsedEntry && Array.isArray(parsedEntry.subprocessos)) {
        if (parsedEntry.subprocessos.length === 0) {
            delete parsedEntry.subprocessos;
        } else {
            parsedEntry.subprocessos = [...new Set(parsedEntry.subprocessos)];
        }
    }

    return parsedEntry;
}

async function find(processId, follow) {
    const state = findStateFromTRCode(processId);
    const sanitizedProcessId = Sanitizer.sanitize(processId);

    const firstInstanceParsedPage = await resolvePage(state.instances.first, sanitizedProcessId, follow);
    const secondInstanceParsedPage = await resolvePage(state.instances.second, sanitizedProcessId, follow);

    const response = {
        primeiraInstancia: firstInstanceParsedPage,
        segundaInstancia: secondInstanceParsedPage,
    };

    if (!(response.primeiraInstancia || response.segundaInstancia)) {
        throw new InquiredDocumentNotFoundException('Não foi possível encontrar dados para esse documento.');
    }

    return response;
}

module.exports = {
    find,
};
