const path = require('path');
const fs = require('fs-extra');
const dayjs = require('dayjs');
const hash = require('sha256');
const outputPath = path.join(__dirname, '..', 'logs', 'usageLog.txt');
fs.ensureFileSync(outputPath);

const logUser = function (u) {
  let now = dayjs().format();
  let data = {
    time: now,
  };
  if (u.casData && u.casData.uid) {
    data.user = hash(u.casData.uid);
  }
  if (u.courseDepts) {
    data.courseDepts = u.courseDepts;
  }
  if (u.majors) {
    data.majors = u.majors;
  }
  if (u.depts) {
    data.courseDepts = u.depts;
  }
  if (u.uniqueSubjects) {
    data.subjects = u.uniqueSubjects;
  }
  if (u.primaryAffiliation) {
    data.primaryAffiliation = u.primaryAffiliation;
  }
  fs.appendFile(outputPath, '\n' + JSON.stringify(data));
};

module.exports = logUser;
