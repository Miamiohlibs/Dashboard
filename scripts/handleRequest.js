const MiamiUser = require('../classes/MiamiUser');
const getUserInfo = require('../scripts/getUserInfo');
const getSierraInfo = require('../scripts/getSierraInfo');
const fakeUserConfig = require('../config/fakeUser.json');
const config = require('config');
let mode;
if (config.has('mode')) {
  mode = config.get('mode');
} else {
  mode == 'undefined';
}

module.exports = async (req) => {
  var user;

  if (req.fakeCas !== undefined) {
    // fakeCas is generated using the preview function
    user = new MiamiUser(req.fakeCas);
  } else if (fakeUserConfig.useFakeUser && fakeUserConfig.fakeUserId) {
    // fakeUser is set in the config/fakeuser file
    var fakeUserFile = fakeUserConfig.fakeUsers[fakeUserConfig.fakeUserId];
    var userjson = require('../fakeUsers/' + fakeUserFile);
    user = new MiamiUser(userjson);
  } else {
    //otherwise, use real user id
    if (global.onServer === true) {
      user = new MiamiUser(req.session.cas);
    }
    if (user === undefined) {
      user = new MiamiUser();
    }
  }

  // remove 'Non-Matriculated' from the list of majors
  if (user.majors && user.majors.includes('Non-Matriculated')) {
    user.majors = user.majors.filter((item) => item != 'Non-Matriculated');
  }
  if (user.majorCodes && user.majorCodes.includes('0000')) {
    user.majorCodes = user.majorCodes.filter((item) => item != '0000');
  }

  const userInfo = getUserInfo(user);
  try {
    console.log('userId:', user.uid);
    const sierraInfo = await getSierraInfo(user.uid);
    if (mode == 'dev') {
      console.log('Sierra info: ', sierraInfo);
    } else {
      console.log(
        'Sierra info received: ' + Object.getOwnPropertyNames(sierraInfo)
      );
    }
    userInfo.sierraInfo = sierraInfo;
  } catch (err) {
    console.error('Failed to get Sierra data:', err);
  }

  return userInfo;
};
