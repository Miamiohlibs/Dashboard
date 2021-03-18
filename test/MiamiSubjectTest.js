// const fs = require('fs');
// const path = require('path');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should;
const MiamiSubject = require('../classes/MiamiSubject.js');
const subjCodes = require('./samples/subjects/subjCodes');

describe('MiamiSubject: construct', () => {
  let obj = new MiamiSubject(subjCodes);
  it('should have this.subjects upon being initialized with data', () => {
    expect(obj).to.haveOwnProperty('subjects');
    expect(obj.subjects.length).to.equal(8);
  });
  it('should have regFields.length == 5', () => {
    expect(obj).to.haveOwnProperty('regFields');
    expect(obj.regFields.length).to.equal(5);
  });
  it('should have majorFields.length == 9', () => {
    expect(obj).to.haveOwnProperty('majorFields');
    expect(obj.majorFields.length).to.equal(9);
  });
  it('should have dcFields.length == 5', () => {
    expect(obj).to.haveOwnProperty('deptFields');
    expect(obj.deptFields.length).to.equal(5);
  });
});

describe('MiamiSubject: findSubjectByCode', () => {
  let obj = new MiamiSubject(subjCodes);
  it('should return "Accountancy" for findSubjectByCode: regCode = acc', () => {
    let result = obj.findSubjectByCode('acc', 'reg');
    expect(result.length).to.equal(1);
    expect(result[0].name).to.equal('Accountancy');
  });
  it('should return "Accountancy" for findSubjectByCode: regCode = ACC', () => {
    let result = obj.findSubjectByCode('ACC', 'reg');
    expect(result.length).to.equal(1);
    expect(result[0].name).to.equal('Accountancy');
  });
  it('should return "Accountancy" for findSubjectByCode: major = BU01', () => {
    let result = obj.findSubjectByCode('BU01', 'major');
    expect(result.length).to.equal(1);
    expect(result[0].name).to.equal('Accountancy');
  });
  it('should return "Adolescent Mathematics Edu" for findSubjectByCode: major = EAME', () => {
    let result = obj.findSubjectByCode('EAME', 'major');
    expect(result.length).to.equal(1);
    expect(result[0].name).to.equal('Adolescent Mathematics Edu');
  });
  it('should return FALSE for findSubjectByCode with wrong code: reg = EAME', () => {
    let result = obj.findSubjectByCode('EAME', 'reg');
    expect(result).to.be.false;
  });
  it('should return FALSE for findSubjectByCode bogus major = xxx', () => {
    let result = obj.findSubjectByCode('xxx', 'major');
    expect(result).to.be.false;
  });
  it('should return FALSE for findSubjectByCode with only one arg', () => {
    let result = obj.findSubjectByCode('EAME');
    expect(result).to.be.false;
  });
  it('should find majorCodes 2-5 successfully, e.g. majorCode FAFC', () => {
    let result = obj.findSubjectByCode('FAFC', 'major'); // majorCode5
    expect(result.length).to.equal(1);
    expect(result[0].name).to.equal('Film Studies');
  });
});

describe('MiamiSubject: findSubjectByCourseNumber', () => {
  let obj = new MiamiSubject(subjCodes);
  it('should return an array of one object for ACC101', () => {
    let result = obj.findSubjectByCourseNumber('ACC101');
    expect(result).to.be.an.array();
    expect(result.length).to.equal(1);
    expect(result[0]).to.haveOwnProperty('libguides');
    expect(result[0].libguides).to.be.an.array();
    expect(result[0].libguides[0]).to.equal('Accountancy');
  });
  it('should return false for ABS', () => {
    let result = obj.findSubjectByCourseNumber('ABS');
    expect(result).to.equal(false);
  });
  it('should return false for XYZ123', () => {
    let result = obj.findSubjectByCourseNumber('XYZ123');
    expect(result).to.equal(false);
  });
});

describe('MiamiSubject: findAllProps()', () => {
  let obj = new MiamiSubject(subjCodes);
  it('should find 1 regCodes', () => {
    let res = obj.findAllProps('reg');
    expect(res.length).to.equal(3);
  });
  it('should find 13 majorCodes', () => {
    let res = obj.findAllProps('major');
    expect(res.length).to.equal(13);
  });
  it('should find 1 deptCode', () => {
    let res = obj.findAllProps('dept');
    expect(res.length).to.equal(2);
  });
  it('should find 8 names', () => {
    let res = obj.findAllProps('name');
    expect(res.length).to.equal(8);
  });
});

describe('MiamiSubject: findDuplicates', () => {
  let obj = new MiamiSubject();
  let goodData = ['MUS', 'POL', 'MJF'];
  let subjCodes = ['MUS', 'POL', 'MUS', 'MJF', 'MJF'];
  it('should find no dups in the goodData', () => {
    let res = obj.findDuplicates(goodData);
    expect(res).to.be.false;
  });
  it('should find dup (MUS) in the bad data', () => {
    let res = obj.findDuplicates(subjCodes);
    expect(res).to.be.array();
    expect(res.length).to.equal(2);
    expect(res[0]).to.equal('MUS');
    expect(res[1]).to.equal('MJF');
  });
});

describe('MiamiSubject: detectMissingLibguides', () => {
  let obj = new MiamiSubject(subjCodes);
  it('should find one missing libguide (ignoring regionals by default)', () => {
    let res = obj.detectMissingLibguides();
    expect(typeof res).to.equal('object');
    expect(res.missingGuides).to.be.array();
    expect(res.missingGuides.length).to.equal(1);
    expect(res.missingGuides[0]).to.not.haveOwnProperty('libguides');
    expect(res.missingGuides[0].majorCode).to.equal('EAME');
  });
  it('should find two missing libguides when not including regionals', () => {
    let res = obj.detectMissingLibguides(true);
    expect(typeof res).to.equal('object');
    expect(res.missingGuides).to.be.array();
    expect(res.missingGuides.length).to.equal(2);
    expect(res.missingGuides[0]).to.not.haveOwnProperty('libguides');
    expect(res.missingGuides[0].majorCode).to.equal('EAME');
    expect(res.missingGuides[1]).to.not.haveOwnProperty('libguides');
    expect(res.missingGuides[1].deptCode).to.equal('hte');
  });
  it('should return list of entries with libguides', () => {
    let res = obj.detectMissingLibguides();
    expect(typeof res).to.equal('object');
    expect(res.havingGuides).to.be.array();
    expect(res.havingGuides.length).to.equal(6);
    expect(res.havingGuides[0]).to.haveOwnProperty('libguides');
  });
});

describe('MiamiSubject: returnFieldValues', () => {
  let obj = new MiamiSubject(subjCodes);
  it('should return array values matching multiple requested fields', () => {
    let sampleObj1 = { regCode: 'ENG', regCode2: 'ENGL', fake: '3' };
    let regFields1 = ['regCode', 'regCode2'];
    let res = obj.returnFieldValues(sampleObj1, regFields1);
    expect(res).to.be.array();
    expect(res.length).to.equal(2);
    expect(res[0]).to.equal('eng');
    expect(res[1]).to.equal('engl');
  });
  it('should return array values matching one requested fields', () => {
    let sampleObj2 = { regCode: 'ENG', regCode2: 'ENGL', fake: '3' };
    let regFields2 = ['regCode'];
    let res = obj.returnFieldValues(sampleObj2, regFields2);
    expect(res).to.be.array();
    expect(res.length).to.equal(1);
    expect(res[0]).to.equal('eng');
  });
  it('should return an empty array when no results found', () => {
    let sampleObj3 = { regCode: 'ENG', regCode2: 'ENGL', fake: '3' };
    let searchFields3 = ['majorCode', 'majorCode2'];
    let res = obj.returnFieldValues(sampleObj3, searchFields3);
    expect(res).to.be.array();
    expect(res.length).to.equal(0);
  });

  it('should be able to override default conversion to lowercase', () => {
    let sampleObj1 = { regCode: 'ENG', regCode2: 'ENGL', fake: '3' };
    let regFields1 = ['regCode', 'regCode2'];
    let res = obj.returnFieldValues(sampleObj1, regFields1, false);
    expect(res).to.be.array();
    expect(res.length).to.equal(2);
    expect(res[0]).to.equal('ENG');
    expect(res[1]).to.equal('ENGL');
  });
});
// Old code using majors instead of subjects
// describe('MiamiSubject: construct', () => {
//   let obj = new MiamiSubject(Majors);
//   it('should have this.majors upon being initialized with data', () => {
//     expect(obj).to.haveOwnProperty('majors');
//     expect(obj.majors.length).to.equal(9);
//   });
// });
// describe('MiamiSubject: findSubjectByCode', () => {
//   let obj = new MiamiSubject(Majors);
//   it('should return false for findSubjectByCode:"aaa"', () => {
//     let result = obj.findSubjectByCode('aaa');
//     expect(result).to.be.false;
//   });
//   it('should return "American Culture and English Program" for findSubjectByCode: ace', () => {
//     let result = obj.findSubjectByCode('ace');
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('American Culture and English Program');
//   });
//   it('should return "American Culture and English Program" for findSubjectByCode: ACE', () => {
//     let result = obj.findSubjectByCode('ACE');
//     expect(result[0].name).to.equal('American Culture and English Program');
//   });
//   it('should return "Anthropology" for findSubjectByCode: ath', () => {
//     let result = obj.findSubjectByCode('ath');
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('Anthropology');
//   });
//   it('should return "Anthropology" for findSubjectByCode: ant', () => {
//     let result = obj.findSubjectByCode('ant');
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('Anthropology');
//   });
//   it('should return false for findSubjectByCode: xxx', () => {
//     let result = obj.findSubjectByCode('xxx');
//     expect(result).to.be.false;
//   });
// });

// describe('MiamiSubject: findSubjectByCourseNumber', () => {
//   let obj = new MiamiSubject(Majors);
//   it('should return an array of one object for ENG101', () => {
//     let result = obj.findSubjectByCourseNumber('ENG101');
//     expect(result).to.be.an.array();
//     expect(result.length).to.equal(1);
//     expect(result[0]).to.haveOwnProperty('libguides');
//     expect(result[0].libguides).to.be.an.array();
//     expect(result[0].libguides[0]).to.equal('English');
//   });
//   it('should return false for ABS', () => {
//     let result = obj.findSubjectByCourseNumber('ABS');
//     expect(result).to.equal(false);
//   });
//   it('should return false for XYZ123', () => {
//     let result = obj.findSubjectByCourseNumber('XYZ123');
//     expect(result).to.equal(false);
//   });
// });

// describe('MiamiSubject: findSubjectByName', () => {
//   let obj = new MiamiSubject(Majors);
//   it('should fail to find name Tetrapyloctomy', () => {
//     let result = obj.findSubjectByName('Tetrapyloctomy');
//     expect(result).to.be.false;
//   });
//   it('should find by name (Accountancy)', () => {
//     let result = obj.findSubjectByName('Accountancy');
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('Accountancy');
//   });
//   it('should find by altName (American and World Cultures)', () => {
//     let result = obj.findSubjectByName('American and World Cultures');
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('American & World Cultures');
//     expect(result[0].altName).to.equal('American and World Cultures');
//   });
//   it('should find by casName (Aerospacial Studies)', () => {
//     let result = obj.findSubjectByName('Aerospacial Studies');
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('Aerospace Studies');
//     expect(result[0].casName).to.equal('Aerospacial Studies');
//   });
// });

// describe('MiamiSubject: findSubjectByAnyCode', () => {
//   let obj = new MiamiSubject(Majors);
//   it('should return "American Culture and English Program" for findSubjectByAnyCode: [ace]', () => {
//     let result = obj.findSubjectByAnyCode(['ace']);
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('American Culture and English Program');
//   });
//   it('should accept a string as if a single-item array for findSubjectByAnyCode', () => {
//     let result = obj.findSubjectByAnyCode('ace');
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('American Culture and English Program');
//   });
//   it('should find correct program when only one valid code in findSubjectByAnyCode', () => {
//     let result = obj.findSubjectByAnyCode(['ace', 'xxx']);
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('American Culture and English Program');
//   });
//   it('should return false for findSubjectByAnyCode when two conflicting codes', () => {
//     let result = obj.findSubjectByAnyCode(['ace', 'ant']);
//     expect(result).to.be.false;
//   });
//   it('should return entry for findSubjectByAnyCode when two non-conflicting codes', () => {
//     let result = obj.findSubjectByAnyCode(['ath', 'ant']);
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('Anthropology');
//   });
// });

// describe('MiamiSubject: findSubjectByAnyName', () => {
//   let obj = new MiamiSubject(Majors);
//   it('should return "American Culture and English Program" for findSubjectByAnyName: [American Culture and English Program]', () => {
//     let result = obj.findSubjectByAnyName([
//       'American Culture and English Program',
//     ]);
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('American Culture and English Program');
//   });
//   it('should accept a string as if a single-item array for findSubjectByAnyName', () => {
//     let result = obj.findSubjectByAnyName(
//       'American Culture and English Program'
//     );
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('American Culture and English Program');
//   });
//   it('should findSubjectByAnyName using altName', () => {
//     let result = obj.findSubjectByAnyName('American and World Cultures');
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('American & World Cultures');
//   });
//   it('should find correct program when only one valid code in findSubjectByAnyName', () => {
//     let result = obj.findSubjectByAnyName([
//       'American Culture and English Program',
//       'Department of Tetrapyloctomy',
//     ]);
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('American Culture and English Program');
//   });
//   it('should return false for findSubjectByAnyName when two conflicting names', () => {
//     let result = obj.findSubjectByAnyName([
//       'American & World Cultures',
//       'American Culture and English Program',
//     ]);
//     expect(result).to.be.false;
//   });
//   it('should return entry for findSubjectByAnyName when two non-conflicting names', () => {
//     let result = obj.findSubjectByAnyName([
//       'American & World Cultures',
//       'American and World Cultures',
//     ]);
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('American & World Cultures');
//   });
// });

// describe('MiamiSubject: addProp', () => {
//   let obj = new MiamiSubject(Majors);
//   it('should be able to add an arbitrary property with addProp', () => {
//     let acc = obj.findSubjectByName('Accountancy')[0];
//     expect(acc.name).to.equal('Accountancy');
//     let res = obj.addProp(acc, 'testing', 'arbitrary');
//     expect(acc.testing).to.equal('arbitrary');
//     expect(acc.two).to.be.undefined;
//   });
// });

// describe('MiamiSubject: addEntry', () => {
//   it('should be able to find a department once added', () => {
//     let obj = new MiamiSubject(Majors);
//     let entry = { progCode: 'testCode', name: 'Bonus Department' };
//     obj.addEntry(entry);
//     let result = obj.findSubjectByCode('testCode');
//     expect(result.length).to.equal(1);
//     expect(result[0].name).to.equal('Bonus Department');
//   });
// });

// This code was not in production. Still needed?
// describe('MiamiSubject: removeSlashes', () => {
//   const obj = new MiamiSubject();
//   const slashTests = [
//     {
//       before: 'Purchasing/Procurement Mgt',
//       after: 'Purchasing/Procurement Mgt',
//     }, // 0
//     { before: 'English', after: 'English' }, // 1
//   ];
//   it('should correctly remove slashes as needed', () => {
//     let done0 = obj.removeSlashes(slashTests[0].before);
//     let done1 = obj.removeSlashes(slashTests[1].before);
//     expect(done0).to.equal(slashTests[0].after);
//     expect(done1).to.equal(slashTests[1].after);
//   });
// });
