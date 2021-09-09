const fs = require('fs');
const path = require('path');
const filepath = path.join(__dirname, '..', 'logs', 'usageLog.txt');
const lineByLine = require('n-readlines');
const liner = new lineByLine(filepath);

getUsageData = function () {
  let line;
  let lineNumber = 0;
  let data = [];
  let output;

  while ((line = liner.next())) {
    //   output = 'Line ' + lineNumber + ': ' + line.toString('ascii');
    let json = line.toString('ascii');
    if (json.length > 0) {
      let obj = JSON.parse(json);
      // console.log(obj);
      if (obj) {
        data.push(obj);
      }
    }
  }
  return data;
};

module.exports = getUsageData;
