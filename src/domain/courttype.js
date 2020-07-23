/**
 * All these  pieces of information were inferred from https://atos.cnj.jus.br/atos/detalhar/atos-normativos?documento=119
 */

const log = require('../logger');

const Sanitizer = require('string-sanitizer');

// NNNNNNN-DD.AAAA.J.TR.OOOO
const pattern = /(\d{7})(\d{2})(\d{4})(\d)(\d{2})(\d{4})/;

const states = [
    {
        'name': 'Alagoas', 'initials': 'AL', 'capital': 'Maceió',
        'instances': {
            'first': 'https://www2.tjal.jus.br/cpopg/open.do',
            'second': ' https://www2.tjal.jus.br/cposg5/open.do'
        },
        'TR': '02',
    },
    {
        'name': 'Mato Grosso do Sul', 'initials': 'MS', 'capital': 'Campo Grande',
        'instances': {
            'first': 'https://esaj.tjms.jus.br/cpopg5/open.do',
            'second': 'https://esaj.tjms.jus.br/cposg5/open.do',
        },
        'TR': '12',
    },
];

function explorePattern(trCode) {
    const matches = trCode.match(pattern);
    if (!matches) {
        throw new Error(`Could not transform the input query into the pattern ${pattern}`);
    }
    return {
        'sequential_process_number': matches[1],
        'origin': matches[6],
        'court': matches[5],
        'digit': matches[2],
        'year': matches[3],
        'segment': matches[4],
    }
}

const reverseStateMapByTRCode = states.reduce((accumulator, entry) => {
    accumulator[entry['TR']] = entry;
    return accumulator;
}, {});

function findStateFromTRCode(trCode) {
    const sanitizedTrCode = Sanitizer.sanitize(trCode);
    const shatteredTrCode = explorePattern(sanitizedTrCode);
    if (!(shatteredTrCode['court'] in reverseStateMapByTRCode)) {
        throw new Error('Could not find this TR Code.');
    }
    return reverseStateMapByTRCode[shatteredTrCode['court']];
}

module.exports = {
    findStateFromTRCode,
}

