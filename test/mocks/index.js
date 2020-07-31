const nock = require('nock');
const fs = require('fs');
const path = require('path');

function mock() {
  const mockRequestPath = path.resolve(__dirname, './requests');
  const ALpath = path.resolve(mockRequestPath, 'AL');
  const MSpath = path.resolve(mockRequestPath, 'MS');

  fs.readdirSync(ALpath).forEach((alProcessFolder) => {
    nock('https://www2.tjal.jus.br')
      .get('/cpopg/search.do')
      .query({
        'dadosConsulta.localPesquisa.cdLocal': '-1',
        cbPesquisa: 'NUMPROC',
        'dadosConsulta.tipoNuProcesso': 'UNIFICADO',
        'dadosConsulta.valorConsultaNuUnificado': alProcessFolder,
      })
      .reply(200, fs.readFileSync(path.resolve(ALpath, alProcessFolder, './firstInstance.html')));
    nock('https://www2.tjal.jus.br')
      .get('/cposg5/search.do')
      .query({
        tipoNuProcesso: 'UNIFICADO',
        cbPesquisa: 'NUMPROC',
        'dePesquisaNuUnificado': alProcessFolder,
      })
      .reply(200, fs.readFileSync(path.resolve(ALpath, alProcessFolder, './secondInstance.html')));
  });

  fs.readdirSync(MSpath).forEach((msProcessFolder) => {
    nock('https://esaj.tjms.jus.br')
      .get('/cpopg5/search.do')
      .query({
        conversationId: '',
        'dadosConsulta.localPesquisa.cdLocal': '-1',
        cbPesquisa: 'NUMPROC',
        'dadosConsulta.tipoNuProcesso': 'UNIFICADO',
        'dadosConsulta.valorConsultaNuUnificado': msProcessFolder,
        pbEnviar: 'Pesquisar',
      })
      .reply(200, fs.readFileSync(path.resolve(MSpath, msProcessFolder, './firstInstance.html')));

    nock('https://esaj.tjms.jus.br')
      .get('/cposg5/search.do')
      .query({
        conversationId: '',
        paginaConsulta: '0',
        cbPesquisa: 'NUMPROC',
        dePesquisaNuUnificado: msProcessFolder,
        dePesquisa: '',
        tipoNuProcesso: 'UNIFICADO',
      })
      .reply(200, fs.readFileSync(path.resolve(MSpath, msProcessFolder, './secondInstance.html')));
  });
}

mock();
module.exports = mock;
