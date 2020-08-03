const cheerio = require('cheerio');
const Sanitizer = require('string-sanitizer');
const {InquiredDocumentNotFoundException} = require('../../../error/domain');
const client = require('./scrapper.client');
const {findStateFromTRCode} = require('./domain/courttype');
const log = require('../../../logger');

async function loadPage(instance, processId) {
    const instancePage = await client.navigate(instance.url(processId));
    return instance.parser(cheerio.load(instancePage));
}

// function saveDebugger(state, sanitizedProcessId, filename, content) {
//     const path = require('path');
//     const fs = require('fs');
//     const primaryFolder = path.resolve(__dirname, `../../../../test/mocks/requests/${state.initials}`);
//     const secondaryFolder = path.resolve(__dirname, `${primaryFolder}/${sanitizedProcessId}`);
//
//     if (!fs.existsSync(secondaryFolder)) {
//         fs.mkdirSync(secondaryFolder);
//     }
//
//     fs.writeFileSync(`${secondaryFolder}/${filename}`, content);
// }

async function resolveParsedPageFollowed(instance, initialProcessId) {
    const stack = [];
    let response = {};

    stack.push({parent: null, processId: initialProcessId});

    while (stack.length > 0) {
        const followedEntry = stack.pop();
        try {
            /* eslint-disable no-await-in-loop */
            const followedPage = await loadPage(instance, followedEntry.processId);

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

    if (!(response.primeiraInstancia || response.segundaInstancia)) {
        throw new InquiredDocumentNotFoundException('Não foi possível encontrar dados para esse documento.');
    }

    return response;
}

module.exports = {
    find,
};
