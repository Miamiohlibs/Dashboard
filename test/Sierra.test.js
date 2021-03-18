/* 
This is set up for Jest, not Chai/Mocha

const Sierra = require('../classes/SierraApi');
const fakeConf = require('./test-data/fakeConf');
const sandConf = require('../config/sandboxConf');
// In order for axios to test ok with jest, this line must be present in package.json
// "jest": { "testEnvironment": "node" }
// see: https://stackoverflow.com/questions/42677387/jest-returns-network-error-when-doing-an-authenticated-request-with-axios


describe('Sierra Api', () => {
  it('should derive an encodedKey on initialization', () => {
    const api = new Sierra(fakeConf);
    expect(api).toHaveProperty('conf');
    expect(api.conf.credentials).toHaveProperty('apiKey','monkey');
    expect(api.conf.credentials).toHaveProperty('clientSecret','sparks');
    expect(api.conf).toHaveProperty('encodedKey')
    expect(api.conf.encodedKey).toBe('bW9ua2V5OnNwYXJrcw==')
  });

  it('should assemble a urlPrefix on initialization', () => {
    const api = new Sierra(sandConf);
    expect(api.conf).toHaveProperty('urlPrefix');
    expect(api.conf.urlPrefix).toBe('https://sandbox.iii.com/iii/sierra-api')
  });

  it('should get a token from the server', async () => {
    const api = new Sierra(sandConf);
    let res  = await api.getToken();
    expect(api).toHaveProperty('accessToken');
    expect(typeof api.accessToken).toBe('string')
    expect(api.accessToken.length).toBeGreaterThan(100);
  })
});
*/