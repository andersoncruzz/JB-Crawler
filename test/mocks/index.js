const nock = require('nock');

function mock() {
    nock('https://www2.tjal.jus.br')
        .get('/cpopg/search.do')
        .query({
            'dadosConsulta.localPesquisa.cdLocal': '-1',
            'cbPesquisa': 'NUMPROC',
            'dadosConsulta.tipoNuProcesso': 'UNIFICADO',
            'dadosConsulta.valorConsultaNuUnificado': '08219015120188120001'
        })
        .reply(200, {'ok': true});
}


module.exports = mock;
