const nock = require('nock');
const fs = require('fs');
const path = require('path');

function mock() {
  nock('https://www2.tjal.jus.br')
    .get('/cpopg/search.do')
    .query({
      'dadosConsulta.localPesquisa.cdLocal': '-1',
      cbPesquisa: 'NUMPROC',
      'dadosConsulta.tipoNuProcesso': 'UNIFICADO',
      'dadosConsulta.valorConsultaNuUnificado': '07108025520188020001',
    })
    .reply(200, fs.readFileSync(path.join(__dirname, './requests/tjal-first-instance/07108025520188020001.html')));

  nock('https://esaj.tjms.jus.br')
    .get('/cpopg5/search.do')
    .query({
      conversationId: '',
      'dadosConsulta.localPesquisa.cdLocal': '-1',
      cbPesquisa: 'NUMPROC',
      'dadosConsulta.tipoNuProcesso': 'UNIFICADO',
      'dadosConsulta.valorConsultaNuUnificado': '08219015120188120001',
      pbEnviar: 'Pesquisar',
    })
    .reply(200, fs.readFileSync(path.join(__dirname, './requests/tjms-first-instance/08219015120188120001.html')));
}

module.exports = mock;
