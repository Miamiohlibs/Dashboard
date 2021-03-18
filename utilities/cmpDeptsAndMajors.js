const fs = require('fs');
const path = require('path');
const rootdir = path.dirname(__dirname);
const depts = require(rootdir + '/cache/DeptCodes.json').data;
const majors = require(rootdir + '/models/Majors');
const MiamiSubject = require(rootdir + '/classes/MiamiSubject');
const ms = new MiamiSubject(majors);
const util = require('util');

depts.forEach((item) => {
  let nameMatch = ms.findSubjectByName(item.description);
  let codeMatch = ms.findSubjectByCode(item.code);
  if (codeMatch.length > 0) {
    console.log('found', item.code);
    console.log('Depts:', item.name);
    console.log('Majors:', codeMatch[0].name);
  }
});
