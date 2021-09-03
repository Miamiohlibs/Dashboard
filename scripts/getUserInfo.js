const path = require('path');
const fs = require('fs');
const subjCodes = require('../models/subjCodes');
const LibAppsDataFilter = require('../classes/LibAppsDataFilter.js');
const f = new LibAppsDataFilter();
const UserInfo = require('../classes/UserInfo');
const missingLog = path.join(__dirname, '..', 'logs', 'missingSubjects.log');
const logger = require('logger').createLogger(missingLog);
const codeMap = require('../models/codeMap');
const MiamiSubject = require('../classes/MiamiSubject');
const ms = new MiamiSubject(subjCodes);
const config = require('config');
const libnData = require('../cache/Librarians');
const Librarians = require('../classes/Librarians');
const libns = new Librarians(libnData);

let mode;
if (config.has('mode')) {
  mode = config.get('mode');
} else {
  mode == 'undefined';
}

module.exports = (user) => {
  u = new UserInfo();
  u.primaryAffiliation = user.primaryAffiliation;
  /* for dev purposes, write the original user input to a file */
  if (mode == 'dev') {
    try {
      const data = fs.writeFileSync(
        path.join(__dirname, '..', 'logs', 'userInput.json'),
        JSON.stringify(user, null, 2)
      );
      //file written successfully
    } catch (err) {
      console.error(err);
    }
  }

  // associations will have properties for reg, dept, major codes
  // each property will have an array of relevant codes
  u.associations = {};

  codeTypes = Object.getOwnPropertyNames(codeMap);

  codeTypes.forEach((type) => {
    u.associations[type] = [];

    // foreach label used with in each codeType...
    codeMap[type].forEach((label) => {
      if (user.hasOwnProperty(label)) {
        u.associations[type] = [
          ...new Set(u.associations[type].concat(user[label])), // set gets unique vals
        ];
      }
    });
  });

  // add in librarian liaison areas
  let userEmail = 'gibsonke@miamioh.edu';
  u.liaisons = libns.getSubjectsByEmail(userEmail);
  u.liaisons.forEach((subjName) => {
    var filename = path.join(
      __dirname,
      '..',
      'cache',
      'subjects',
      f.safeFilename(subjName) + '.json'
    );
    try {
      var fileContents = JSON.parse(
        String(fs.readFileSync(filename, (err) => {}))
      );
    } catch (err) {
      if (err.code == 'ENOENT') {
        var msg = 'File not found: ' + filename + ' ' + JSON.stringify(user);
        console.log(msg);
        logger.error(msg);
      } else {
        console.log('Error:', err);
      }
      var fileContents = {};
    }
    u.addSubject('liaison', subjName, fileContents);
  });

  // now that we have a full list of codes listed by type, get names and libguides for each

  codeTypes.forEach((type) => {
    if (
      u.associations.hasOwnProperty(type) &&
      u.associations[type].length > 0
    ) {
      u.associations[type].forEach((code) => {
        let res = ms.findSubjectByCode(code, type);
        let subjName = res[0].name;
        var filename = path.join(
          __dirname,
          '..',
          'cache',
          'subjects',
          f.safeFilename(subjName) + '.json'
        );
        try {
          var fileContents = JSON.parse(
            String(fs.readFileSync(filename, (err) => {}))
          );
        } catch (err) {
          if (err.code == 'ENOENT') {
            var msg =
              'File not found: ' + filename + ' ' + JSON.stringify(user);
            console.log(msg);
            logger.error(msg);
          } else {
            console.log('Error:', err);
          }
          var fileContents = {};
        }
        u.addSubject(type, subjName, fileContents);
      });
    }
  });

  let allSubjects = u.majors.concat(u.courseDepts).sort();
  if (u.primaryAffiliation != 'student') {
    // only add department stuff for non-students
    // otherwise they get junk for their work-study job
    allSubjects = allSubjects.concat(u.depts);
    allSubjects = allSubjects.concat(u.liaisons);
  }
  u.uniqueSubjects = allSubjects.filter((item, index) => {
    return allSubjects.indexOf(item) === index;
  }); //de-duplicate major+course

  u.casData = user;
  if (u.casData.givenName === undefined) {
    u.casData.givenName = 'TestUser';
  }

  /* for dev purposes, write the output to a file */
  if (mode == 'dev') {
    try {
      const data = fs.writeFileSync(
        path.join(__dirname, '..', 'logs', 'userOutput.json'),
        JSON.stringify(u, null, 2)
      );
      //file written successfully
    } catch (err) {
      console.error(err);
    }
  }
  return u;
};
