const cheerio = require('cheerio');
const Sanitizer = require('string-sanitizer');
const _ = require('lodash');
const {InquiredDocumentNotFoundException} = require('../../../error/domain');
const client = require('./scrapper.client');
const {findStateFromTRCode} = require('./domain/courttype');
const log = require('../../../logger');

async function resolvePage(instance, processId, save = false) {
    const instancePage = await client.navigate(instance.url(processId));

    if (process.argv.indexOf('--save-to-test') >= 0 && save) {
        const url = encodeURIComponent(instance.url(processId));
        saveDebugger(url, 'response', instancePage, 'extra-mocks');
    }
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

function saveDebugger(sanitizedProcessId, filename, content, folder) {
    const path = require('path');
    const fs = require('fs');
    const primaryFolder = path.resolve(__dirname, `../../../../test/mocks/${folder}`);
    const secondaryFolder = path.resolve(__dirname, `${primaryFolder}/${sanitizedProcessId}`);

    if (!fs.existsSync(secondaryFolder)) {
        fs.mkdirSync(secondaryFolder);
    }

    fs.writeFileSync(`${secondaryFolder}/${filename}`, content);
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

    if (process.argv.indexOf('--save-to-test') >= 0) {
        saveDebugger(sanitizedProcessId, 'firstInstance.html', await client.navigate(state.instances.first.url(sanitizedProcessId)), 'requests');
        saveDebugger(sanitizedProcessId, 'secondInstance.html', await client.navigate(state.instances.second.url(sanitizedProcessId)), 'requests');
        saveDebugger(sanitizedProcessId, 'response.json', JSON.stringify(response), 'requests');
    }

    if (!(response.primeiraInstancia || response.segundaInstancia)) {
        throw new InquiredDocumentNotFoundException('Não foi possível encontrar dados para esse documento.');
    }

    return response;
}

module.exports = {
    find,
};
