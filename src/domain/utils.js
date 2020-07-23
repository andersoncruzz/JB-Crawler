const log = require('../logger');

function normalizeHTMLString(str) {
    return str.replace(/[\n|\t]/g, '').replace(/ +/g, ' ').trim();
}

function getInnerText(page, selector) {
    return normalizeHTMLString(page(selector).text());
}

function getEntities(page, selector, delimiter = ':') {
    const text = page(selector).text().replace(/\n+/g, '<>').replace(/ +/, ' ').trim();
    const shattered = [].concat.apply([], (text.split(':').map(e => e.split('<>').map(normalizeHTMLString).filter(e => e.length > 0))))

    const entities = {};
    for (let i = 0; i < shattered.length; i += 2) {
        const entityName = shattered[i];
        const entityValue = shattered[i + 1];
        if (!(entityName in entities)) {
            entities[entityName] = [];
        }
        entities[entityName].push(entityValue);
    }
    return entities;
}

module.exports = {
    normalizeHTMLString,
    getInnerText,
    getEntities,
}
