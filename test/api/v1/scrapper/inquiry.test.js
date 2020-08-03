const path = require('path');
const fs = require('fs');
const mocks = require('../../../mocks');

describe('Brands FindAll Controller', () => {
    before(() => {
        mocks();
    });

    const mockRequestPath = path.resolve(__dirname, '../../../mocks/requests');

    describe(`Testcases for processes enclosed in ${mockRequestPath}`, () => {
        fs.readdirSync(mockRequestPath).forEach((folder) => {
            const processRequestFolder = path.resolve(mockRequestPath, folder);
            it(`Recover AL document ${folder}`, async () => {
                const {
                    body, ok, status, type,
                } = await global.request.get(`/rest/v1/inquiry/${folder}?follow=true`);
                expect(ok).to.equal(true);
                expect(status).to.equal(200);
                expect(type).to.equal('application/json');
                expect(body).to.deep.equal(JSON.parse(fs.readFileSync(path.resolve(processRequestFolder, './response.json'), 'utf-8')));
            });
        });
    });
});
