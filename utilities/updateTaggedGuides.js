/*
create one file per tag used in the cached Guides.js 
only for tags that look like a course number (e.g. ART101, ENGL 201, ACC245N)
for each tag, create a file with all the guide objects using that tag
file names like: /cache/taggedGuides/ITS402N.json

These will be treated as featured guides in the Dashboard for users with courses matching the tag
*/

const fs = require('fs');
const path = require('path');
const rootdir = path.dirname(__dirname);
const guides = require(rootdir + '/cache/Guides');
const config = require('config');
const allowedGroups = config.get('app.allowed_group_ids');
const LibAppsDataFilter = require(rootdir + '/classes/LibAppsDataFilter');
const f = new LibAppsDataFilter();

// limit to published guides
pubGuides = f.removeUnpublishedGuides(guides);

// limit to certain libguide group ids, e.g. exclude admin guides, other campuses, etc.
rightGroups = f.removeWrongGroups(pubGuides, allowedGroups);

// generate map of tags and associated guides
tagMap = f.mapTags(rightGroups);
// console.log(tagMap);

// create each file and populate it with the associated content (guides list)
for (let [key, value] of tagMap) {
  var filename = path.join(
    rootdir,
    'cache',
    'taggedGuides',
    f.safeFilename(key) + '.json'
  );
  fs.writeFile(filename, JSON.stringify(value, null, 2), function (err) {
    if (err) throw err;
  });
}
