/*
There are multiple ways of codifying subject data. This class will be used to 
normalize data describing subject areas from different lists.
Sources include:
* dept codes (including non-academic depts)
* registrar (course number) codes (e.g. ENG200 -> ENG = English)
* major codes (e.g. RCEG -> English Studies, AS18 -> English: Literature)

These are all aggregated along with associated libguides in models/subjCodes.js
*/

module.exports = class MiamiSubject {
  constructor(data) {
    this.subjects = data;
    /* list all the fields that might exist for any one type */
    this.nameFields = ['name'];
    this.regFields = [
      'regCode',
      'regCode2',
      'regCode3',
      'regCode4',
      'regCode5',
    ];
    this.deptFields = [
      'deptCode',
      'deptCode2',
      'deptCode3',
      'deptCode4',
      'deptCode5',
    ];
    this.majorFields = [
      'majorCode',
      'majorCode2',
      'majorCode3',
      'majorCode4',
      'majorCode5',
      'majorCode6',
      'majorCode7',
      'majorCode8',
      'majorCode9',
    ];
  }

  detectMissingLibguides(includeRegionals = false) {
    let res = {};
    let subjects = this.subjects;
    if (!includeRegionals) {
      subjects = subjects.filter((item) => {
        return !item.hasOwnProperty('regional') || item.regional == false;
      });
    }
    // console.log('in medias res', subjects);
    res.missingGuides = subjects.filter(
      (item) => !item.hasOwnProperty('libguides')
    );
    res.havingGuides = subjects.filter((item) =>
      item.hasOwnProperty('libguides')
    );
    return res;
  }

  findSubjectByCode(code, codeType = undefined) {
    code = code.toLowerCase();
    if (codeType == undefined) {
      return false;
    }
    let codeTag = codeType + 'Code';
    let codeFields = this[codeType + 'Fields'];

    // return results where correct codeTag value matches code
    let matches = this.subjects.filter((entry) => {
      let values = this.returnFieldValues(entry, codeFields);
      if (values.includes(code)) {
        return true;
      }
      return false;
    });

    if (matches && matches.length == 1) {
      return matches;
    }

    return false;
  }

  findSubjectByCourseNumber(str) {
    /* search for registrar code based on course number */
    let re = /([A-Z]{2,5}) *([0-9]{2,5})/;
    let output = str.match(re);
    if (output === null) {
      return false;
    } else {
      let code = output[1];
      let response = this.findSubjectByCode(code, 'reg');
      return response;
    }
  }

  /*
    findAllProps  
    expects a codeType that be one of ['major','dept','reg']
    returns a single array of all instances of this codeType in the objects
    */
  findAllProps(codeType) {
    let subjects = this.subjects;
    // console.log(subjCodes instanceof Array);
    // console.log(subjects);
    let codeKeys = this[codeType + 'Fields'];
    let res = subjects.map((arr) => {
      let vals = [];
      codeKeys.forEach((k) => {
        if (arr.hasOwnProperty(k)) {
          vals.push(arr[k]);
        }
      });
      return vals;
    });
    var merged = [].concat.apply([], res);
    return merged;
  }

  findDuplicates(arr) {
    var uniq = arr
      .map((code) => {
        return {
          count: 1,
          code: code,
        };
      })
      .reduce((a, b) => {
        a[b.code] = (a[b.code] || 0) + b.count;
        return a;
      }, {});

    var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
    if (duplicates.length > 0) {
      return duplicates;
    }
    return false;
  }

  /* 
return array of values from all specified fields in an object
ex: 
obj = { 'deptCode': 'eng', 'deptCode2': 'engl', name:'english'}
fieldArr = ['deptCode','deptCode2']
method will return ['eng','engl']
values will be converted to lower case
*/
  returnFieldValues(obj, fieldsArr, convertToLower = true) {
    let results = [];
    for (let [key, value] of Object.entries(obj)) {
      if (fieldsArr.includes(key)) {
        if (convertToLower) {
          value = value.toLowerCase();
        }
        results.push(value);
      }
    }
    return results;
  }
};
