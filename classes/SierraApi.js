const Base64 = require('js-base64').Base64;
const axios = require('axios');

module.exports = class SierraApi {
  constructor(conf) {
    this.conf = conf;
    let keyText = conf.credentials.apiKey + ':' + conf.credentials.clientSecret;
    this.conf.encodedKey = Base64.encode(keyText);
    this.conf.urlPrefix = 'https://' + conf.server + conf.apiPath;
  }

  async getToken() {
    try {
      let json = await axios({
        method: 'post',
        url: this.conf.urlPrefix + this.conf.endpoints.token,
        headers: {
          'Authorization': 'Basic ' + this.conf.encodedKey
        }
      });
      this.accessToken = json.data.access_token;
      return this.accessToken;
    } catch (err) {
      console.log(err)
    }
  }

  async patronFind(params) {
    return await this.query('/v5/patrons/find', params);
  }

  async patronQuery(queryType, patronId) {
    // QueryTypes: checkouts, holds, fines 
    let endpoint = '/v5/patrons/' + patronId + '/' + queryType;
    return await this.query(endpoint)
  }

  async query(endpoint, params = {}, method = 'get') {
    let json = await axios({
      method: method,
      url: this.conf.urlPrefix + endpoint,
      params: params,
      headers: {
        'Authorization': 'Bearer ' + this.accessToken
      }
    });
    return json;
  }
}