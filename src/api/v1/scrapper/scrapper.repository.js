const cheerio = require('cheerio');
const Sanitizer = require('string-sanitizer');
const {InquiredDocumentNotFoundException} = require('../../../error/domain');
const client = require('./scrapper.client');
const {findStateFromTRCode} = require('./domain/courttype');
const log = require('../../../logger');

async function loadPage(instance, processId, save = false) {
    const instancePage = await client.navigate(instance.url(processId));

    if (process.argv.indexOf('--save-to-test') >= 0 && save) {
        const url = encodeURIComponent(instance.url(processId));
        saveDebugger(url, 'response', instancePage, 'extra-mocks');
    }
    return instance.parser(cheerio.load(instancePage));
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

async function resolveParsedPageFollowed(instance, initialProcessId) {
    const stack = [];
    let response = null;
    let first = true;

    stack.push({parent: null, processId: initialProcessId});

    while (stack.length > 0) {
        const followedEntry = stack.pop();
        try {
            /* eslint-disable no-await-in-loop */
            const followedPage = await loadPage(instance, followedEntry.processId, !first);
            if (first) {
                first = false;
            }

            if (followedPage) {
                if (followedPage._subprocessos && Array.isArray(followedPage._subprocessos) && followedPage._subprocessos.length > 0) {
                    followedPage._subprocessos.forEach((subprocesso) => stack.push({
                        parent: followedPage,
                        processId: Sanitizer.sanitize(subprocesso),
                    }));
                    followedPage.subprocessos = {};
                    delete followedPage._subprocessos;
                }

                if (followedEntry.parent) {
                    followedEntry.parent.subprocessos[followedEntry.processId] = followedPage;
                } else {
                    response = followedPage;
                }
            }
        } catch (err) {
            log.info(`Could not load document ${followedEntry.processId} -> ${err.message}`);
        }
    }

    return response;
}

async function resolveParsedPage(instance, initialProcessId, follow) {
    if (!follow) {
        const response = await loadPage(instance, initialProcessId);
        if (response && response._subprocessos) {
            response.subprocessos = response._subprocessos;
            delete response._subprocessos;
        }
        return response;
    }
    return resolveParsedPageFollowed(instance, initialProcessId);
}

async function find(processId, follow) {
    const state = findStateFromTRCode(processId);
    const sanitizedProcessId = Sanitizer.sanitize(processId);

    const firstInstanceParsedPage = await resolveParsedPage(state.instances.first, sanitizedProcessId, follow);
    const secondInstanceParsedPage = await resolveParsedPage(state.instances.second, sanitizedProcessId, follow);

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
