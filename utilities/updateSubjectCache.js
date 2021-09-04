/*
The script reads the cached Librarians, Databases, and Guides (LD&G); then for each 
subject, it outputs a the combined data from LD&G for that subject into a file:  
/cache/subjects/[SubjectName].js 

These cached subject files are the main data used by the Dashboard.

Note: this file should be refactored. Right now we compile all the Miami subject
areas, and then also create single-subject files for all the liaison areas. They
mostly use the same code, but right now it's repeated with only slight variations. 
Do better! -kri, 2021-09-0
*/

const fs = require('fs');
const path = require('path');
const rootdir = path.dirname(__dirname);
const librarians = require(rootdir + '/cache/Librarians');
const databases = require(rootdir + '/cache/Databases');
const guides = require(rootdir + '/cache/Guides');
const subjects = require(rootdir + '/cache/Subjects');
// const majors = require(rootdir + '/models/Majors');
const subjCodes = require(rootdir + '/models/subjCodes');
const config = require('config');
const allowedGroups = config.get('app.allowed_group_ids');
const LibAppsDataFilter = require(rootdir + '/classes/LibAppsDataFilter');

const f = new LibAppsDataFilter();
subjCodes.forEach((m) => {
  // console.log(m.name, m.libguides);
  if (m.libguides !== undefined && m.libguides !== null) {
    subj = f.findSubjectByName(subjects, m.libguides);
    libns = f.getBestBySubject(librarians, m.libguides);
    pubGuides = f.removeUnpublishedGuides(guides);

    // limit to certain libguide group ids, e.g. exclude admin guides, other campuses, etc.
    rightGroups = f.removeWrongGroups(pubGuides, allowedGroups);

    gds = f.getBestBySubject(rightGroups, m.libguides);
    dbs = f.getBestBySubject(databases, m.libguides, true);
    let results = {
      metadata: {
        sizeof: {
          librarians: libns.length,
          guides: gds.length,
          databases: dbs.length,
        },
      },
      subjects: subj,
      librarians: libns,
      guides: gds,
      databases: dbs,
    };
    // console.log(results);

    // get all possible subject names,
    // write subject contents to a file for each one
    var names = [];
    ['name', 'regName', 'deptName', 'majorName'].forEach((prop) => {
      if (m.hasOwnProperty(prop)) {
        var filename = path.join(
          rootdir,
          'cache',
          'subjects',
          f.safeFilename(m[prop]) + '.json'
        );

        fs.writeFile(
          filename,
          JSON.stringify(results, null, 2),
          function (err) {
            if (err) throw err;
          }
        );
        // console.log(filename);
      }
    });
  }
});

// and then do it again for liaison subjects that don't already have a file:
// come up with a list of all the libguide subject areas
let lgshNames = subjects.map((i) => i.name);
lgshNames.forEach((subjectName) => {
  // for each one that doesn't already have a file
  // create an array of one, e.g. ['Area Studies']
  // and process it as a subject

  let oneSubjArray = [subjectName];
  subj = f.findSubjectByName(subjects, oneSubjArray);
  libns = f.getBestBySubject(librarians, oneSubjArray);
  pubGuides = f.removeUnpublishedGuides(guides);

  // limit to certain libguide group ids, e.g. exclude admin guides, other campuses, etc.
  rightGroups = f.removeWrongGroups(pubGuides, allowedGroups);

  gds = f.getBestBySubject(rightGroups, oneSubjArray);
  dbs = f.getBestBySubject(databases, oneSubjArray, true);
  let results = {
    metadata: {
      sizeof: {
        librarians: libns.length,
        guides: gds.length,
        databases: dbs.length,
      },
    },
    subjects: subj,
    librarians: libns,
    guides: gds,
    databases: dbs,
  };

  // then write it to a file if such a file wasn't created in the previous step
  let filename = path.join(
    __dirname,
    '..',
    'cache',
    'subjects',
    f.safeFilename(subjectName) + '.json'
  );
  if (!fs.existsSync(filename)) {
    fs.writeFileSync(filename, JSON.stringify(results), { flag: 'wx' });
  }
});
