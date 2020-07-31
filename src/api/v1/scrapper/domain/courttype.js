/**
 * All these  pieces of information were inferred from https://atos.cnj.jus.br/atos/detalhar/atos-normativos?documento=119
 */
const Sanitizer = require('string-sanitizer');

const pattern = /(\d{7})(\d{2})(\d{4})(\d)(\d{2})(\d{4})/;
const {getInnerText} = require('./utils');
const log = require('../../../../logger');
const APB = require('../../../../models/AbstractParserBuilder');
const {RequestedCourtNotFoundException, CatchableException} = require('../../../../error/domain');

const states = [
    {
        name: 'Alagoas',
        initials: 'AL',
        capital: 'Maceió',
        instances: {
            first: {
                url: (processId) => `https://www2.tjal.jus.br/cpopg/search.do?&dadosConsulta.localPesquisa.cdLocal=-1&cbPesquisa=NUMPROC&dadosConsulta.tipoNuProcesso=UNIFICADO&dadosConsulta.valorConsultaNuUnificado=${processId}`,
                parser: (page) => {
                    if (getInnerText(page, '#mensagemRetorno > li') === 'Não existem informações disponíveis para os parâmetros informados.') {
                        return null;
                    }
                    if(getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table:nth-child(2) > tbody > tr > td:nth-child(1) > h2').trim() === ''){
                        return null;
                    }

                    return new APB(page)
                        .fromTableAsEntity('body > div.div-conteudo > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr', 'processo',
                            [
                                {
                                    keyName: 'classe',
                                    keys: 'Classe',
                                    unique: true,
                                },
                                {
                                    keyName: 'area',
                                    keys: 'Área',
                                    unique: true,
                                },
                                {
                                    keyName: 'assunto',
                                    keys: 'Assunto',
                                    unique: true,
                                },
                                {
                                    keyName: 'distribuicao',
                                    keys: 'Distribuição',
                                    unique: true,
                                    parser: (field) => field.match(/\d{2}\/\d{2}\/\d{4}/)[0],
                                },
                                {
                                    keyName: 'juiz',
                                    keys: 'Juiz',
                                    unique: true,
                                },
                                {
                                    keyName: 'valor_acao',
                                    keys: 'Valor da ação',
                                    unique: true,
                                },
                            ])
                        .fromTableAsGenericEntities('#tablePartesPrincipais > tbody > tr', 'partes')
                        .fromTable('#tabelaTodasMovimentacoes > tr', 'movimentacoes', {
                            data: 'td:nth-child(1)',
                            movimento: 'td:nth-child(3)',
                        })
                        .getObject();
                },
            },
            second: {
                url: (processId) => `https://www2.tjal.jus.br/cposg5/search.do?cbPesquisa=NUMPROC&tipoNuProcesso=UNIFICADO&dePesquisaNuUnificado=${processId}`,
                parser: (page) => {
                    if (getInnerText(page, '#mensagemRetorno > li') === 'Não existem informações disponíveis para os parâmetros informados.') {
                        return null;
                    }
                    return new APB(page)
                        .fromTableAsEntity('body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(5) > table.secaoFormBody > tbody > tr', 'processo',
                            [
                                {
                                    keyName: 'classe',
                                    keys: 'Classe',
                                    unique: true,
                                },
                                {
                                    keyName: 'area',
                                    keys: 'Área',
                                    unique: true,
                                },
                                {
                                    keyName: 'assunto',
                                    keys: 'Assunto',
                                    unique: true,
                                },
                                {
                                    keyName: 'distribuicao',
                                    keys: 'Distribuição',
                                    unique: true,
                                },
                                {
                                    keyName: 'juiz',
                                    keys: 'Juiz',
                                    unique: true,
                                },
                                {
                                    keyName: 'valor_acao',
                                    keys: 'Valor da ação',
                                    unique: true,
                                },
                            ])
                        .fromTableAsGenericEntities('#tablePartesPrincipais > tbody > tr', 'partes')
                        .fromTable('#tabelaTodasMovimentacoes > tr', 'movimentacoes', {
                            data: 'td:nth-child(1)',
                            movimento: 'td:nth-child(3)',
                        })
                        .getObject();
                },
            },
        },
        TR: '02',
    },
    {
        name: 'Mato Grosso do Sul',
        initials: 'MS',
        capital: 'Campo Grande',
        instances: {
            first: {
                url: (processId) => `https://esaj.tjms.jus.br/cpopg5/search.do?conversationId=&dadosConsulta.localPesquisa.cdLocal=-1&cbPesquisa=NUMPROC&dadosConsulta.tipoNuProcesso=UNIFICADO&dadosConsulta.valorConsultaNuUnificado=${processId}&pbEnviar=Pesquisar`,
                parser: (page) => {
                    if (getInnerText(page, '#mensagemRetorno > li') === 'Não existem informações disponíveis para os parâmetros informados.') {
                        return null;
                    }
                    return new APB(page)
                        .fromTableAsEntity('body > div.div-conteudo > table:nth-child(4) > tbody > tr > td > div:nth-child(9) > table.secaoFormBody > tbody > tr', 'processo',
                            [
                                {
                                    keyName: 'classe',
                                    keys: 'Classe',
                                    unique: true,
                                },
                                {
                                    keyName: 'area',
                                    keys: 'Área',
                                    unique: true,
                                },
                                {
                                    keyName: 'assunto',
                                    keys: 'Assunto',
                                    unique: true,
                                },
                                {
                                    keyName: 'data_distribuicao',
                                    keys: 'Distribuição',
                                    unique: true,
                                    parser: (field) => field.match(/\d{2}\/\d{2}\/\d{4}/)[0],
                                },
                                {
                                    keyName: 'juiz',
                                    keys: 'Juiz',
                                    unique: true,
                                },
                                {
                                    keyName: 'valor_acao',
                                    keys: 'Valor da ação',
                                    unique: true,
                                },
                            ])

                        .fromTableAsGenericEntities('#tablePartesPrincipais > tbody > tr', 'partes')
                        .fromTable('#tabelaTodasMovimentacoes > tr', 'movimentacoes', {
                            data: 'td:nth-child(1)',
                            movimento: 'td:nth-child(3)',
                        })
                        .getObject();
                },
            },
            second: {
                url: (processId) => `https://esaj.tjms.jus.br/cposg5/search.do?conversationId=&paginaConsulta=0&cbPesquisa=NUMPROC&dePesquisaNuUnificado=${processId}&dePesquisa=&tipoNuProcesso=UNIFICADO`,
                parser: (page) => {
                    if (getInnerText(page, '#mensagemRetorno > li') !== '') {
                        return null;
                    }
                    return new APB(page)
                        .fromSelector('processo.classe', 'body > div.unj-entity-header > div.unj-entity-header__summary > div > div:nth-child(2) > div:nth-child(1) > div > span')
                        .fromSelector('processo.area', 'body > div.unj-entity-header > div.unj-entity-header__summary > div > div:nth-child(2) > div.col-md-2 > div > span')
                        .fromSelector('processo.assunto', 'body > div.unj-entity-header > div.unj-entity-header__summary > div > div:nth-child(2) > div.col-md-4 > div > span')
                        .fromSelector('processo.juiz', 'body > div.div-conteudo.container.unj-mb-40 > table:nth-child(12) > tbody > tr > td:nth-child(4)')
                        .fromSelector('processo.valor_acao', '#maisDetalhes > div > div:nth-child(2) > div > span')
                        .fromTableAsGenericEntities('#tablePartesPrincipais > tbody > tr', 'partes')
                        .fromTable('#tabelaTodasMovimentacoes > tr', 'movimentacoes', {
                            data: 'td:nth-child(1)',
                            movimento: 'td:nth-child(3)',
                        })
                        .getObject();
                },
            },

        },
        TR: '12',
    },
];

function explorePattern(trCode) {
    const matches = trCode.match(pattern);
    if (!matches) {
        throw new CatchableException(`Não foi possível identificar o padrão ${pattern}`);
    }
    return {
        sequential_process_number: matches[1],
        origin: matches[6],
        court: matches[5],
        digit: matches[2],
        year: matches[3],
        segment: matches[4],
        sanitizedCode: trCode,
    };
}

const reverseStateMapByTRCode = states.reduce((accumulator, entry) => {
    accumulator[entry.TR] = entry;
    return accumulator;
}, {});

function findStateFromTRCode(processId) {
    const sanitizedProcessId = Sanitizer.sanitize(processId);
    const shatteredProcessId = explorePattern(sanitizedProcessId);
    if (!(shatteredProcessId.court in reverseStateMapByTRCode)) {
        throw new RequestedCourtNotFoundException('Não foi possível encontrar esse tribunal');
    }
    return reverseStateMapByTRCode[shatteredProcessId.court];
}

module.exports = {
    findStateFromTRCode,
};
