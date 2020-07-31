const cheerio = require('cheerio');
const Sanitizer = require('string-sanitizer');
const {InquiredDocumentNotFoundException} = require('../../../error/domain');
const client = require('./scrapper.client');
const {findStateFromTRCode} = require('./domain/courttype');

async function find(processId, save = false) {
    const state = findStateFromTRCode(processId);
    const sanitizedProcessId = Sanitizer.sanitize(processId);

    const firstInstancePage = await client.navigate(state.instances.first.url(sanitizedProcessId));
    const secondIntancePage = await client.navigate(state.instances.second.url(sanitizedProcessId));
    const firstInstanceParsedPage = cheerio.load(firstInstancePage);
    const secondInstanceParsedPage = cheerio.load(secondIntancePage);

    const response = {
        primeiraInstancia: state.instances.first.parser(firstInstanceParsedPage),
        segundaInstancia: state.instances.second.parser(secondInstanceParsedPage),
    };
    if (!(response.primeiraInstancia || response.segundaInstancia)) {
        throw new InquiredDocumentNotFoundException('Não foi possível encontrar dados para esse documento.');
    }

    if (save) {
        const path = require('path');
        const fs = require('fs');
        const primaryFolder = path.resolve(__dirname, `../../../../test/mocks/requests/${state.initials}`)
        const secondaryFolder = path.resolve(__dirname, `${primaryFolder}/${sanitizedProcessId}`);

        if (!fs.existsSync(secondaryFolder)) {
            fs.mkdirSync(secondaryFolder);
        }

        fs.writeFileSync(`${secondaryFolder}/response.json`, JSON.stringify(response, null, 2));
        fs.writeFileSync(`${secondaryFolder}/firstInstance.html`, firstInstancePage);
        fs.writeFileSync(`${secondaryFolder}/secondInstance.html`, secondIntancePage);
    }

    return response;
}

module.exports = {
    find,
};
