const fs = require('fs');
const path = require('path');
const rootdir = path.dirname(__dirname);
const rawMaj = require(rootdir + '/cache/Majors.raw.json').data;
const majors = require(rootdir + '/models/Majors');
const MiamiSubject = require(rootdir + '/classes/MiamiSubject');
const util = require('util');

const output = new MiamiSubject(majors);

/* 
  For each majore in the raw majors list (from registrar), 
  look up that subject by both name and code in the existing
  models/Majors file.
  If partial information (has name or code but not both), update the 
  models/Majors file with the added info. 
  If missing entirely, add it to the majors list. 
*/

rawMaj.forEach((item) => {
  let res = output.findSubjectByName(item.description);
  let res2 = output.findSubjectByCode(item.code);
  if (res.length == 1) {
    if (res.hasOwnProperty('progCode')) {
      if (res.progCode != item.code) {
        res.altCode = item.code; // set the altCode if progCode is taken
      }
    } else {
      res.progCode = item.code;
    }
  } else if (res2.length == 1) {
    if (res2.hasOwnProperty('casName')) {
      if (res2.casName != item.description) {
        res2.altName = item.description;
      }
    } else {
      res2.casName = item.description;
    }
  } else if (res == false) {
    let entry = { progCode: item.code, name: item.description };
    output.addEntry(entry);
  } else {
    // multiple possible rows
    // console.log('--------------------');
    // console.log('Multple entries for ', item.description);
    // console.log(res);
  }
});

output.majors.sort((a, b) => (a.name > b.name ? 1 : -1));
console.log(
  'const majors =',
  util.inspect(output.majors, {
    showHidden: false,
    depth: null,
    maxArrayLength: null,
  }) + ';\nmodule.exports = majors;'
);
