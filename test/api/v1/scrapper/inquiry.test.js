const mocks = require('../../../mocks');
const path = require('path');
const fs = require('fs');

describe('Brands FindAll Controller', () => {
    before(() => {
        mocks();
    });

    const mockRequestPath = path.resolve(__dirname, '../../../mocks/requests');
    const ALpath = path.resolve(mockRequestPath, 'AL');
    const MSpath = path.resolve(mockRequestPath, 'MS');

    describe(`Testcases for AL enclosed in ${ALpath}`, () => {
        fs.readdirSync(ALpath).forEach((alProcessFolder) => {
            it(`Recover AL document ${alProcessFolder}`, async () => {
                const {body, ok, status, type} = await global.request.get(`/rest/v1/inquiry/${alProcessFolder}`);
                expect(ok).to.equal(true);
                expect(status).to.equal(200);
                expect(type).to.equal('application/json');
                expect(body).to.deep.equal(JSON.parse(fs.readFileSync(path.resolve(ALpath, alProcessFolder, './response.json'), 'utf-8')));
            });
        });
    });

    describe(`Testcases for MS enclosed in ${MSpath}`, () => {
        fs.readdirSync(MSpath).forEach((msProcessFolder) => {
            it(`Recover MS document ${msProcessFolder}`, async () => {
                const {body, ok, status, type} = await global.request.get(`/rest/v1/inquiry/${msProcessFolder}`);
                expect(ok).to.equal(true);
                expect(status).to.equal(200);
                expect(type).to.equal('application/json');
                expect(body).to.deep.equal(JSON.parse(fs.readFileSync(path.resolve(MSpath, msProcessFolder, './response.json'), 'utf-8')));
            });
        });
    })
});
