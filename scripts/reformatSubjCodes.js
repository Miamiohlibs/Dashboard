/*
2021-11-08: reformatting models/subjCodes.js into a json array for MyGuide-v2
*/

const subjCodes = require('../models/subjCodes');
let totalOutput = [];
for (entry in subjCodes) {
  let output = {
    name: subjCodes[entry].name,
  };
  if (subjCodes[entry].hasOwnProperty('libguides')) {
    output.libguides = subjCodes[entry].libguides;
  }
  if (subjCodes[entry].hasOwnProperty('regional')) {
    output.regional = subjCodes[entry].regional;
  }
  let positions = ['', '2', '3', '4', '5', '6', '7', '8', '9'];

  // regCodes
  for (i in positions) {
    let key = 'regCode' + positions[i];
    let nameKey = 'regName' + positions[i];
    let arr = 'regCodes';
    if (subjCodes[entry].hasOwnProperty(key)) {
      if (!output.hasOwnProperty(arr)) {
        output[arr] = [];
      }
      output[arr].push({
        regCode: subjCodes[entry][key],
        regName: subjCodes[entry][nameKey],
      });
    }
  }

  // majorCodes
  for (i in positions) {
    let key = 'majorCode' + positions[i];
    let nameKey = 'majorName' + positions[i];
    let arr = 'majorCodes';
    if (subjCodes[entry].hasOwnProperty(key)) {
      if (!output.hasOwnProperty(arr)) {
        output[arr] = [];
      }
      output[arr].push({
        majorCode: subjCodes[entry][key],
        majorName: subjCodes[entry][nameKey],
      });
    }
  }

  // deptCodes
  for (i in positions) {
    let key = 'deptCode' + positions[i];
    let nameKey = 'deptName' + positions[i];
    let arr = 'deptCodes';
    if (subjCodes[entry].hasOwnProperty(key)) {
      if (!output.hasOwnProperty(arr)) {
        output[arr] = [];
      }
      output[arr].push({
        deptCode: subjCodes[entry][key],
        deptName: subjCodes[entry][nameKey],
      });
    }
  }
  totalOutput.push(output);
}
console.log(JSON.stringify(totalOutput, null, 2));
