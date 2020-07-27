/**
 * All these  pieces of information were inferred from https://atos.cnj.jus.br/atos/detalhar/atos-normativos?documento=119
 */
const Sanitizer = require('string-sanitizer');

const pattern = /(\d{7})(\d{2})(\d{4})(\d)(\d{2})(\d{4})/;
const { getInnerText, getEntities } = require('./utils');
const APB = require('../models/AbstractParserFactory');
const { InquiredDocumentNotFoundException } = require('../error/domain');

const states = [
  {
    'name': 'Alagoas',
    'initials': 'AL',
    'capital': 'Maceió',
    'instances': {
      'first': {
        'url': (processId) => `https://www2.tjal.jus.br/cpopg/search.do?&dadosConsulta.localPesquisa.cdLocal=-1&cbPesquisa=NUMPROC&dadosConsulta.tipoNuProcesso=UNIFICADO&dadosConsulta.valorConsultaNuUnificado=${processId}`,
        'parser': (page) => {
          if (getInnerText(page, '#mensagemRetorno > li') === 'Não existem informações disponíveis para os parâmetros informados.') {
            throw new InquiredDocumentNotFoundException('Could not find the specified inquired document.');
          }

          return new APB(page)
            .fromSelector('classe', 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr > td > span:nth-child(1)')
            .fromEntity('body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr > td',
              [{ 'unique': true, 'keyName': 'area', 'keys': ['Área'] }])
            .fromSelector('assunto', 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(4) > td:nth-child(2) > span')
            .fromSelector('data_distribuicao', 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(6) > td:nth-child(2) > span')
            .fromSelector('juiz', 'tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(9) > td:nth-child(2) > span')
            .fromSelector('valor_acao', 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(10) > td:nth-child(2) > span')
            .fromEntity('#tablePartesPrincipais > tbody > tr:nth-child(1)',
              [
                {
                  'keyName': 'partes.autor.nome',
                  'keys': ['Autor', 'Autora'],
                  'unique': true,
                },
                {
                  'keyName': 'partes.autor.advogados',
                  'keys': ['Advogado', 'Advogada'],
                  'merge': true,
                },
                {
                  'keyName': 'partes.autor.representantes',
                  'keys': ['RepreLeg'],
                },
              ])
            .fromEntity('#tablePartesPrincipais > tbody > tr:nth-child(2)',
              [
                {
                  'keyName': 'partes.reu.nome',
                  'keys': ['Réu', 'Ré'],
                  'unique': true,
                },
                {
                  'keyName': 'partes.reu.advogados',
                  'keys': ['Advogado', 'Advogada'],
                  'merge': true,
                },
                {
                  'keyName': 'partes.reu.representantes',
                  'keys': ['RepreLeg'],
                },
              ])
            .fromTable('#tabelaTodasMovimentacoes > tr', 'movimentacoes', {
              'data': 'td:nth-child(1)',
              'movimento': 'td:nth-child(3)',
            })
            .getObject();

          // return {
          //     'classe': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr > td > span:nth-child(1)'),
          //     'area': getEntities(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr > td')('Área')[0],
          //     'assunto': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(4) > td:nth-child(2) > span'),
          //     'data_distribuicao': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(6) > td:nth-child(2) > span'),
          //     'juiz': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(9) > td:nth-child(2) > span'),
          //     'valor_acao': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(7) > table.secaoFormBody > tbody > tr:nth-child(10) > td:nth-child(2) > span'),
          //     'partes': {
          //         'autor': {
          //             'nome': authorEntities(['Autor', 'Autora'])[0],
          //             'advogados': authorEntities(['Advogado', 'Advogada'], true),
          //             'representantes': authorEntities(['RepreLeg']),
          //         },
          //         're': {
          //             'nome': issuerEntities(['Réu', 'Ré'])[0],
          //             'advogados': issuerEntities(['Advogado', 'Advogada'], true),
          //             'representantes': issuerEntities(['RepreLeg']),
          //         }
          //     },
          //     'movimentações': page('#tabelaTodasMovimentacoes > tr').toArray().map(item => ({
          //         'data': getInnerText(page, 'td:nth-child(1)', item),
          //         'movimento': getInnerText(page, 'td:nth-child(3)', item)
          //     })),
          // };
        },
      },
      'second': {},
    },
    'TR': '02',
  },
  {
    'name': 'Mato Grosso do Sul',
    'initials': 'MS',
    'capital': 'Campo Grande',
    'instances': {
      'first': {
        'url': (processId) => `https://esaj.tjms.jus.br/cpopg5/search.do?conversationId=&dadosConsulta.localPesquisa.cdLocal=-1&cbPesquisa=NUMPROC&dadosConsulta.tipoNuProcesso=UNIFICADO&dadosConsulta.valorConsultaNuUnificado=${processId}&pbEnviar=Pesquisar`,
        'parser': (page) => {
          if (getInnerText(page, '#mensagemRetorno > li') === 'Não existem informações disponíveis para os parâmetros informados.') {
            throw new InquiredDocumentNotFoundException('Could not find the specified inquired document.');
          }
          const authorEntities = getEntities(page, '#tablePartesPrincipais > tbody > tr:nth-child(1)');
          const issuerEntities = getEntities(page, '#tablePartesPrincipais > tbody > tr:nth-child(2)');
          return {
            'classe': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(9) > table.secaoFormBody > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > span:nth-child(1) > span'),
            'area': getEntities(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(9) > table.secaoFormBody > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr > td')('Área')[0],
            'assunto': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(9) > table.secaoFormBody > tbody > tr:nth-child(4) > td:nth-child(2) > span'),
            'data_distribuicao': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(9) > table.secaoFormBody > tbody > tr:nth-child(5) > td:nth-child(2) > span'),
            'juiz': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(9) > table.secaoFormBody > tbody > tr:nth-child(8) > td:nth-child(2) > span'),
            'valor_acao': getInnerText(page, 'body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(9) > table.secaoFormBody > tbody > tr:nth-child(9) > td:nth-child(2) > span'),
            'partes': {
              'autor': {
                'nome': authorEntities(['Autor', 'Autora'])[0],
                'advogados': authorEntities(['Advogado', 'Advogada'], true),
                'representantes': authorEntities(['RepreLeg']),
              },
              'reu': {
                'nome': issuerEntities(['Réu', 'Ré'])[0],
                'advogados': issuerEntities(['Advogado', 'Advogada'], true),
                'representantes': issuerEntities(['RepreLeg']),
              },
            },
            'movimentações': page('#tabelaTodasMovimentacoes > tr').toArray().map((item) => ({
              'data': getInnerText(page, 'td:nth-child(1)', item),
              'movimento': getInnerText(page, 'td:nth-child(3)', item),
            })),
          };
        },
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
    throw new Error('Could not find this TR Code.');
  }
  return reverseStateMapByTRCode[shatteredProcessId.court];
}

module.exports = {
  findStateFromTRCode,
};
