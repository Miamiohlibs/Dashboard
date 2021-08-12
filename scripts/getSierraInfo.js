const SierraApi = require('../classes/SierraApi');
const conf = require('../config/sierraConf');
const sierra = new SierraApi(conf);
const fakeUserConf = require('../config/fakeUser.json');

async function getData(userId = conf.defaultUser) {
  // if using fake circ data, just return it now
  if (fakeUserConf.useFakeCirc == true) {
    return fakeUserConf.fakeCircData;
  }

  //default to ken info if no userid given (test accts)
  try {
    let token = await sierra.getToken();
    // console.log('Got accessToken:', token);
  } catch (err) {
    console.error('Error getting accessToken:', err);
  }

  try {
    // define params to lookup user by userid
    // it will return an "id" needed for subsequent API calls
    const params = {
      varFieldTag: 'u', //uid
      varFieldContent: userId, //received as argument
      fields: 'moneyOwed,id',
    };
    let res = await sierra.patronFind(params);
    // console.log('Bibs response:', res.data);
    let user = {
      patronId: res.data.id,
      display: {
        moneyOwed: res.data.moneyOwed,
        accountLink: 'https://' + conf.server + '/patroninfo.html',
      },
    };
    let resCheckouts = await sierra.patronQuery('checkouts', user.patronId);
    user.display.numCheckouts = resCheckouts.data.total;
    let resHolds = await sierra.patronQuery('holds', user.patronId);
    user.display.numHolds = resHolds.data.total;
    // console.log(user.display);
    // const sierraData = user.display;
    return user.display;
  } catch (err) {
    console.log(err);
  }
}

module.exports = getData;
