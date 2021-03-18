const path = require('path');
const rootdir = path.dirname(__dirname);
const colors = require('colors');
const LibGuideSubjects = require('../classes/LibGuideSubjects');
const lgSubjects = require(rootdir + '/cache/Subjects');
const lgshBak = require(rootdir + '/cache/Subjects.bak');
// if (process.argv.includes('--create'))

curr = new LibGuideSubjects(lgSubjects);
currList = curr.getList('name');
bak = new LibGuideSubjects(lgshBak);
bakList = bak.getList('name');

newlyAdded = curr.missingFromSecond(currList, bakList);
newlyRemoved = curr.missingFromSecond(bakList, currList);

if (!(newlyAdded === true && newlyRemoved === true)) {
  console.log(
    'The subject list has changed; please take these changes into account before proceeding'
      .yellow
  );
  console.log('Newly added:', newlyAdded);
  console.log('Newly removed:', newlyRemoved);
}
