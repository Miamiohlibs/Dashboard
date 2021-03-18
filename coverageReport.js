const fs = require('fs');
const subjDir = './cache/subjects/';
const outputFileName = subjDir + '_coverageReport.csv';

//initialize file
fs.writeFileSync(outputFileName, 'Subject\tLibrarians\tGuides\tDatabases\n');

fs.readdirSync(subjDir)
  .filter((el) => /\.json$/.test(el)) // only the .json files
  .forEach((file) => {
    const data = fs.readFileSync(subjDir + file, {
      encoding: 'utf8',
      flag: 'r',
    });
    const obj = JSON.parse(data);
    const line =
      file +
      '\t' +
      obj.metadata.sizeof.librarians +
      '\t' +
      obj.metadata.sizeof.guides +
      '\t' +
      obj.metadata.sizeof.databases +
      '\n';
    fs.writeFileSync(outputFileName, line, { flag: 'a+' });
    // console.log(obj.metadata.sizeof);
  });
console.log('Output written to:', outputFileName);
