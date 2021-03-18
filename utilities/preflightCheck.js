const colors = require('colors');
const fs = require('fs');
const path = require('path');
const rootdir = path.dirname(__dirname);

const requiredFiles = [
  rootdir + '/cache/Databases.js',
  rootdir + '/cache/Guides.js',
  rootdir + '/cache/Librarians.js',
  rootdir + '/cache/Subjects.js',
];

requiredFiles.forEach((file) => {
  try {
    if (!fs.existsSync(file)) {
      var msg = 'NOTICE: Missing file - app may not run:' + file;
      console.error(msg.yellow);
    }
  } catch (err) {
    console.error(err);
  }
});

var files = fs
  .readdirSync(rootdir + '/cache/subjects/')
  .filter((fn) => fn.endsWith('.json'));
if (files.length < 1) {
  var msg =
    'WARNING: Missing files - No subject files created in ' +
    rootdir +
    '/cache/subjects';
  console.error(msg.red);
  var solution = 'Run: ' + rootdir + '/getData.sh to retrieve cache files';
  console.error(solution.yellow);
}
