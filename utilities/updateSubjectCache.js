/*
The script reads the cached Librarians, Databases, and Guides (LD&G); then for each 
subject, it outputs a the combined data from LD&G for that subject into a file:  
/cache/subjects/[SubjectName].js 

These cached subject files are the main data used by the Dashboard.
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
      }
    });
  }
});
