const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should;
const Sierra = require('../classes/SierraApi');
const fakeConf = require('./samples/fakeSierraConf');
const sandConf = require('../config/sandboxConf');

// If we port this test back to Jest, you'll want to know this:
// In order for axios to test ok with jest, this line must be present in package.json
// "jest": { "testEnvironment": "node" }
// see: https://stackoverflow.com/questions/42677387/jest-returns-network-error-when-doing-an-authenticated-request-with-axios

describe('Sierra Api', () => {
  it('should derive an encodedKey on initialization', () => {
    const api = new Sierra(fakeConf);
    expect(api).to.have.property('conf');
    expect(api.conf.credentials).to.have.property('apiKey', 'monkey');
    expect(api.conf.credentials).to.have.property('clientSecret', 'sparks');
    expect(api.conf).to.have.property('encodedKey');
    expect(api.conf.encodedKey).to.equal('bW9ua2V5OnNwYXJrcw==');
  });

  it('should assemble a urlPrefix on initialization', () => {
    const api = new Sierra(sandConf);
    expect(api.conf).to.have.property('urlPrefix');
    expect(api.conf.urlPrefix).to.equal(
      'https://sandbox.iii.com/iii/sierra-api'
    );
  });

  it('should get a token from the server [NOTE: if this fails, it may be because the API key for the III sandbox has expired, which it is set to do every 6 months, because III loves us. The test failure may not indicate that the code has gone bad. Request a new key through the Supportal.]', async () => {
    const api = new Sierra(sandConf);
    let res = await api.getToken();
    expect(api).to.have.property('accessToken');
    expect(typeof api.accessToken).to.equal('string');
    expect(api.accessToken.length).to.be.greaterThan(100);
  });
});
