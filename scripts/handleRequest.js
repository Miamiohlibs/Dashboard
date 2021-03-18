const MiamiUser = require('../classes/MiamiUser');
const getUserInfo = require('../scripts/getUserInfo');
const getSierraInfo = require('../scripts/getSierraInfo');
const fakeUserConfig = require('../config/fakeUser.json');

module.exports = async (req) => {
  var user;
  if (fakeUserConfig.useFakeUser && fakeUserConfig.fakeUserId) {
    var fakeUserFile = fakeUserConfig.fakeUsers[fakeUserConfig.fakeUserId];
    var userjson = require('../fakeUsers/' + fakeUserFile);
    user = new MiamiUser(userjson);
  } else {
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

  const userInfo = getUserInfo(user);
  try {
    console.log('userId:', user.uid);
    const sierraInfo = await getSierraInfo(user.uid);
    console.log('Sierra info: ', sierraInfo);
    userInfo.sierraInfo = sierraInfo;
  } catch (err) {
    console.error('Failed to get Sierra data:', err);
  }

  return userInfo;
};
