const mocks = require('../../../mocks');

describe('Brands FindAll Controller', () => {
  before(() => {
    mocks();
  });

  it('Should return a complete sentence of process 07108025520188020001', async () => {
    const response = await request.get('/rest/v1/inquiry/07108025520188020001');
    const { body } = response;
    expect(body).to.deep.equal(require('../../../mocks/requests/tjal-first-instance/07108025520188020001.json'));
  });

  it('Should return a complete sentence of process 08219015120188120001', async () => {
    const response = await request.get('/rest/v1/inquiry/08219015120188120001');
    const { body } = response;
    expect(body).to.deep.equal(require('../../../mocks/requests/tjms-first-instance/08219015120188120001.json'));
  });
});
