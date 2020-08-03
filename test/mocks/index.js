const nock = require('nock');
const fs = require('fs');
const path = require('path');
const {findStateFromTRCode} = require('../../src/api/v1/scrapper/domain/courttype');

function mock() {
    const mockRequestPath = path.resolve(__dirname, './requests');

    fs.readdirSync(mockRequestPath).forEach((folder) => {
        const state = findStateFromTRCode(folder);
        const processFolder = path.resolve(mockRequestPath, folder);
        switch (state.initials) {
            case 'AL': {
                nock('https://www2.tjal.jus.br')
                    .get('/cpopg/search.do')
                    .query({
                        'dadosConsulta.localPesquisa.cdLocal': '-1',
                        cbPesquisa: 'NUMPROC',
                        'dadosConsulta.tipoNuProcesso': 'UNIFICADO',
                        'dadosConsulta.valorConsultaNuUnificado': folder,
                    })
                    .reply(200, fs.readFileSync(path.resolve(processFolder, './firstInstance.html')));
                nock('https://www2.tjal.jus.br')
                    .get('/cposg5/search.do')
                    .query({
                        tipoNuProcesso: 'UNIFICADO',
                        cbPesquisa: 'NUMPROC',
                        dePesquisaNuUnificado: folder,
                    })
                    .reply(200, fs.readFileSync(path.resolve(processFolder, './secondInstance.html')));
            }
                break;
            case 'MS': {
                nock('https://esaj.tjms.jus.br')
                    .get('/cpopg5/search.do')
                    .query({
                        conversationId: '',
                        'dadosConsulta.localPesquisa.cdLocal': '-1',
                        cbPesquisa: 'NUMPROC',
                        'dadosConsulta.tipoNuProcesso': 'UNIFICADO',
                        'dadosConsulta.valorConsultaNuUnificado': folder,
                        pbEnviar: 'Pesquisar',
                    })
                    .reply(200, fs.readFileSync(path.resolve(processFolder, './firstInstance.html')));

                nock('https://esaj.tjms.jus.br')
                    .get('/cposg5/search.do')
                    .query({
                        conversationId: '',
                        paginaConsulta: '0',
                        cbPesquisa: 'NUMPROC',
                        dePesquisaNuUnificado: folder,
                        dePesquisa: '',
                        tipoNuProcesso: 'UNIFICADO',
                    })
                    .reply(200, fs.readFileSync(path.resolve(processFolder, './secondInstance.html')));
            }
                break;
        }
    });


}

mock();
module.exports = mock;
