/**
 * All these  pieces of information were inferred from https://atos.cnj.jus.br/atos/detalhar/atos-normativos?documento=119
 */
const Sanitizer = require('string-sanitizer');
const pattern = /(\d{7})(\d{2})(\d{4})(\d)(\d{2})(\d{4})/;
const {getInnerText, getEntities} = require('./utils');
const log = require('../logger');

const states = [
    {
        'name': 'Alagoas', 'initials': 'AL', 'capital': 'Maceió',
        'instances': {
            'first': {
                'url': (processId) => `https://www2.tjal.jus.br/cpopg/search.do?conversationId=&dadosConsulta.localPesquisa.cdLocal=-1&cbPesquisa=NUMPROC&dadosConsulta.tipoNuProcesso=UNIFICADO&dadosConsulta.valorConsultaNuUnificado=${processId}`,
                'parser': (page) => {

                    const authorEntities = getEntities(page, '#tablePartesPrincipais > tbody > tr:nth-child(1)');
                    const issuerEntities = getEntities(page, '#tablePartesPrincipais > tbody > tr:nth-child(2)');

                    return {
                        'classe': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr > td > span:nth-child(1)'),
                        'area': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr > td > span'),
                        'assunto': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(4) > td:nth-child(2) > span'),
                        'data_distribuicao': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(6) > td:nth-child(2) > span'),
                        'juiz': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(9) > td:nth-child(2) > span'),
                        'valor_acao': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(10) > td:nth-child(2) > span'),
                        'partes': {
                            'autor': {
                                'nome': authorEntities['Autor'][0],
                                'advogados': authorEntities['Advogado'],
                            },
                            're': {
                                'nome': issuerEntities['Ré'][0],
                                'advogados': issuerEntities['Advogado'],
                            }
                        },
                        'movimentações': page('#tabelaTodasMovimentacoes > tr').toArray().map(item => ({
                            'data': getInnerText(page, 'td:nth-child(1)', item),
                            'movimento': getInnerText(page, 'td:nth-child(3)', item)
                        })),
                    };
                }
            },
            'second': {
                'url': 'https://www2.tjal.jus.br/cposg5/open.do'
            },
        },
        'TR': '02',
    },
    {
        'name': 'Mato Grosso do Sul', 'initials': 'MS', 'capital': 'Campo Grande',
        'instances': {
            'first': {
                'url': 'https://esaj.tjms.jus.br/cpopg5/open.do'
            },
            'second': {
                'url': 'https://esaj.tjms.jus.br/cposg5/open.do',
            },
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
        'sanitizedCode': trCode,
    }
}

const reverseStateMapByTRCode = states.reduce((accumulator, entry) => {
    accumulator[entry['TR']] = entry;
    return accumulator;
}, {});

function findStateFromTRCode(processId) {
    const sanitizedProcessId = Sanitizer.sanitize(processId);
    const shatteredProcessId = explorePattern(sanitizedProcessId);
    if (!(shatteredProcessId['court'] in reverseStateMapByTRCode)) {
        throw new Error('Could not find this TR Code.');
    }
    return reverseStateMapByTRCode[shatteredProcessId['court']];
}

module.exports = {
    findStateFromTRCode,
}

