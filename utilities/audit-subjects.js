const colors = require('colors');
const fs = require('fs');
const path = require('path');
const rootdir = path.dirname(__dirname);

const majors = require(rootdir + '/models/Majors');

// find Majors with no name
const majNoName = majors.filter((item) => item.name == null);
const majNoCode = majors.filter((item) => (item.code == item.casCode) == null);
const casCodeNoLibguides = majors.filter(
  (item) => item.casCode != null && item.libguides == null
);

let msg = majNoName.length + ' items missing name field';
if (majNoName.length > 0) {
  console.log(msg.yellow);
  console.log(majNoName);
} else {
  console.log(msg.green);
}

msg = majNoCode.length + ' items missing code/casCode field';
if (majNoCode.length > 0) {
  console.log(msg.yellow);
  console.log(majNoCode);
} else {
  console.log(msg.green);
}

msg = casCodeNoLibguides.length + ' items with casCode but not libguide';
if (casCodeNoLibguides.length > 0) {
  console.log(msg.yellow);
  console.log(casCodeNoLibguides);
} else {
  console.log(msg.green);
}
