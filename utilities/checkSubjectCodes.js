/*
 * checks to see that there is no duplication in subjCodes
 * checks to identify missing regCodes, deptCodes, majorCodes
 * doesn't care about majorCodes from regional campuses (RC.*)
 *
 *  optional flags:
 *  -d verbose for deptCodes
 *  -i include regionals (not included by default)
 *  -m verbose for majorCodes
 *  -n verbose for noLibGuides
 *  -r verbose for regCodes (registrar/course codes)
 *  -v verbose (explode data for missing info)
 */
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const rootdir = path.dirname(__dirname);
let outputPathMissingGuides = path.join(
  __dirname,
  '..',
  'cache',
  'subjectsWithoutLibguides.csv'
);
/* reg, dept, and major codes are the three data sources */
const regCodes = require(rootdir + '/models/regCodes');
const deptCodes = require(rootdir + '/models/deptCodes');
const majorCodes = require(rootdir + '/models/majorCodes').data;
/* subjCodes combines data from the previous 3 sources */
const subjCodes = require(rootdir + '/models/subjCodes');
const lgSubjects = require(rootdir + '/cache/Subjects');
const Ladf = require(rootdir + '/classes/LibAppsDataFilter');
const f = new Ladf();
const MiamiSubject = require(rootdir + '/classes/MiamiSubject');
const ms = new MiamiSubject(subjCodes);
const flags = process.argv.slice(2)[0];
let summary = '';
let jsonOutput = {};
let verbose = false;
let verboseMajors = false;
let verboseReg = false;
let verboseDept = false;
let includeRegionals = false;
let verboseNoLibguides = false;
let verboseLibGuideNameErrors = false;
if (flags) {
  if (flags.includes('v')) {
    verbose = true;
  }
  if (flags.includes('m')) {
    verboseMajors = true;
  }
  if (flags.includes('r')) {
    verboseReg = true;
  }
  if (flags.includes('d')) {
    verboseDept = true;
  }
  if (flags.includes('i')) {
    includeRegionals = true;
  }
  if (flags.includes('n')) {
    verboseNoLibguides = true;
  }
  if (flags.includes('l')) {
    verboseLibGuideNameErrors = true;
  }
}

/* PART 1. Look for duplicated codes */

// function dupReport(label, content) {
//   let fields = ms.findAllProps(label);
//   let dups = ms.findDuplicates(fields);
//   if (dups) {
//     str = label + 'Dups: ' + true;
//     dupSummary = str.yellow;
//     return {summary: dupSummary, json: dups}
//   } else {
//     str = label + 'Dups: ' + false;
//     return { summary: str.green,  }
//   }
// }

let names = ms.findAllProps('name');
let nameDups = ms.findDuplicates(names);
console.log('NameDups', nameDups);

let regSubjCodes = ms.findAllProps('reg');
let regDups = ms.findDuplicates(regSubjCodes);
console.log('RegDups', regDups);

let majorSubjCodes = ms.findAllProps('major');
let majorDups = ms.findDuplicates(majorSubjCodes);
console.log('MajorDups', majorDups);

let deptSubjCodes = ms.findAllProps('dept');
let deptDups = ms.findDuplicates(deptSubjCodes);
console.log('DeptDups', deptDups);

let numDups =
  0 +
  (nameDups.length || 0) +
  (deptDups.length || 0) +
  (majorDups.length || 0) +
  (regDups.length || 0);
let dupMsg = 'Duplicate Entries Found: ' + numDups;
if (numDups > 0) {
  console.log(dupMsg.yellow);
} else {
  console.log(dupMsg.green);
}

/* Part 2. Are all deptCodes, regCodes, majorCodes represented? */

/*
foreach code of each type, does it return 1 code? 
*/

// let res = ms.findSubjectByCode('ENG', 'reg');
// console.log(majorCodes);

function reportMissing(list, codeType, codeField = 'code') {
  let missing = [];
  let extant = [];
  let missingLibguides = [];
  let haveLibguides = [];
  list.forEach((item) => {
    let res = ms.findSubjectByCode(item[codeField], codeType);
    if (res) {
      extant.push(item);
    } else {
      missing.push(item);
    }
  });
  return {
    missing: missing.length,
    missingList: missing,
    extant: extant.length,
    codeType: codeType,
  };
}

let res = reportMissing(majorCodes, 'major');
let missingMsg = 'Majors missing from subjCodes file: ' + res.missing;
let extantMsg = 'Majors included in subjCodes file: ' + res.extant;
let addMajorList = res.missingList.map((i) => {
  return { name: i.description, majorCode: i.code, majorName: i.description };
});
if (res.missing > 0) {
  console.log(missingMsg.yellow);
} else {
  console.log(missingMsg.green);
}
console.log(extantMsg.green);
if (verbose || verboseMajors) {
  addMajorList.sort((a, b) => (a.name > b.name ? 1 : -1));
  console.log('Missing MajorCodes:', addMajorList);
}

res = reportMissing(deptCodes.data, 'dept');
missingMsg = 'Depts missing from subjCodes file: ' + res.missing;
extantMsg = 'Depts included in subjCodes file: ' + res.extant;
let addDeptList = res.missingList.map((i) => {
  let regionalCodes = ['dmid', 'dham', 'drgl'];
  let obj = {
    name: i.name,
    deptCode: i.code,
    deptName: i.name,
  };
  if (
    regionalCodes.includes(i.parent) ||
    regionalCodes.includes(i.division_prefix)
  ) {
    obj.regional = true;
  }
  return obj;
});
if (res.missing > 0) {
  console.log(missingMsg.yellow);
} else {
  console.log(missingMsg.green);
}
console.log(extantMsg.green);
if (verbose || verboseDept) {
  addDeptList.sort((a, b) => (a.name > b.name ? 1 : -1));
  console.log('Missing DeptCodes:', addDeptList);
}

res = reportMissing(regCodes, 'reg', 'regCode');
missingMsg = 'RegCodes missing from subjCodes file: ' + res.missing;
extantMsg = 'RegCodes included in subjCodes file: ' + res.extant;
let addRegList = res.missingList.map((i) => {
  return { name: i.regName, regCode: i.regCode, regName: i.regName };
});
if (verbose || verboseReg) {
  console.log('Missing RegCodes:', addRegList);
}

if (res.missing > 0) {
  console.log(missingMsg.yellow);
} else {
  console.log(missingMsg.green);
}
console.log(extantMsg.green);

/* Part 3. Are any subject codes missing a LibGuides assignment (probably lots) */

let { missingGuides, havingGuides } =
  ms.detectMissingLibguides(includeRegionals);

missingMsg = 'Subjects missing Libguides:' + missingGuides.length;
extantMsg = 'Subjects have Libguides:' + havingGuides.length;

if (missingGuides.length > 0) {
  console.log(missingMsg.yellow);
  if (!verbose & !verboseNoLibguides) {
    console.log('Use -n to list subjects without LibGuides'.yellow);
  }
} else {
  console.log(missingMsg.green);
}

if (verbose || verboseNoLibguides) {
  console.log(
    'Subjects missing libguides: ',
    JSON.stringify(missingGuides, null, 2)
  );
  // output as CSV to ../cache/missing.csv
  fs.writeFileSync(
    outputPathMissingGuides,
    [
      'Name',
      'Registrar Course Code',
      'Major/Minor Code',
      'Department Code',
    ].join(',') + '\n'
  );
  missingGuides.forEach((i) => {
    fs.appendFileSync(
      outputPathMissingGuides,
      [i.name.replace(/,/g, ' '), i.regCode, i.majorCode, i.deptCode].join(
        ','
      ) + '\n'
    );
  });
  msg = 'CSV data output to: ' + outputPathMissingGuides + '';
  console.log(msg.yellow);
}

let libguideNameErrors = [];
ms.subjects.forEach((e) => {
  if (e.hasOwnProperty('libguides')) {
    // console.log(e);
    if (e.libguides instanceof Array) {
      e.libguides.forEach((s) => {
        let res = f.findSubjectByName(lgSubjects, [s]);
        if (res[0] == undefined) {
          libguideNameErrors.push('No libguide subject for: "' + s + '"');
        }
      });
    } else if (e.libguides !== null) {
      // allow null to skip
      libguideNameErrors.push(
        'libguides value is not an array in: "' + e.name + '"'
      );
    }
  }
});

let lgneMsg = 'Libguides with invalid names: ' + libguideNameErrors.length;
if (libguideNameErrors.length > 0) {
  console.log(lgneMsg.red);
  if (verbose || verboseLibGuideNameErrors) {
    console.log('LibGuide name errors', libguideNameErrors);
  } else {
    console.log('use -l to display invalid names'.red);
  }
} else {
  console.log(lgneMsg.green);
}
