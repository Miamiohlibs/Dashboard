const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
chai.use(deepEqualInAnyOrder);
const assert = require('chai').assert;
const { expect } = chai;
const should = require('chai').should;
const testData = require('./samples/usage/usageLog');
const Usage = require('../classes/Usage');
const usage = new Usage();

describe('Usage: getDates', () => {
  it('Should return six datestamps', () => {
    let expectedDates = [
      '2021-08-30T11:59:11-04:00',
      '2021-08-31T13:28:01-04:00',
      '2021-08-31T13:28:36-04:00',
      '2021-09-01T11:59:11-04:00',
      '2021-09-01T13:28:01-04:00',
      '2021-09-01T13:28:36-04:00',
    ];
    let dateArray = usage.getDates(testData);
    expect(dateArray[0]).to.equal(expectedDates[0]);
    expect(dateArray[5]).to.equal(expectedDates[5]);
  });
});

describe('Usage: getFirstMonth', () => {
  it('Should return the correct first month: Aug 2021', () => {
    let expectedFirstMonth = '2021-08';
    let firstMonth = usage.getFirstMonth(testData);
    expect(firstMonth).to.equal(expectedFirstMonth);
  });
});

describe('Usage: getFirstDate', () => {
  it('Should return the correct first month: 30 Aug 2021', () => {
    let expectedFirstDate = '2021-08-30';
    let firstDate = usage.getFirstDate(testData);
    expect(firstDate).to.equal(expectedFirstDate);
  });
});

describe('Usage: filterDataByDate (Day)', () => {
  it('Should return two entries for 31 Aug 2021', () => {
    let filtered = usage.filterDataByDate(testData, '2021-08-31', 'day');
    expect(filtered.length).to.equal(2);
  });
  it('Should return three entries for 1 Sept 2021', () => {
    let filtered = usage.filterDataByDate(testData, '2021-09-01', 'day');
    expect(filtered.length).to.equal(3);
  });
});

describe('Usage: filterDataByDate (Month)', () => {
  it('Should return three entries for Aug 2021', () => {
    let filtered = usage.filterDataByDate(testData, '2021-08', 'month');
    expect(filtered.length).to.equal(3);
  });
  it('Should return three entries for Sept 2021', () => {
    let filtered = usage.filterDataByDate(testData, 'Sep 2021', 'month');
    expect(filtered.length).to.equal(3);
  });
});

describe('Usage: filterDataByDate (Year)', () => {
  it('Should return six entries for 2021', () => {
    let filtered = usage.filterDataByDate(testData, '2021', 'year');
    expect(filtered.length).to.equal(6);
  });
  it('Should return zero entries for 2020', () => {
    let filtered = usage.filterDataByDate(testData, '2020', 'year');
    expect(filtered.length).to.equal(0);
  });
});

describe('Usage: filterDataByUsertype', () => {
  it('Should return four entries for staff', () => {
    let filtered = usage.filterDataByUsertype(testData, 'staff');
    expect(filtered.length).to.equal(4);
  });
  it('Should return two entries for student', () => {
    let filtered = usage.filterDataByUsertype(testData, 'student');
    expect(filtered.length).to.equal(2);
  });
});

describe('Usage: distinctUsers', () => {
  it('Should find five distinct users', () => {
    let filtered = usage.distinctUsers(testData);
    expect(filtered).to.equal(5);
  });
});

describe('Usage: eachTimePeriodSince (month)', () => {
  it('Should find eight months from Jan-Aug 2021', () => {
    let months = usage.eachTimePeriodSince('month', 'Jan 2021', 'Aug 2021');
    expect(months.length).to.equal(8);
    expect(months[0]).to.equal('2021-01');
    expect(months[3]).to.equal('2021-04');
    expect(months[7]).to.equal('2021-08');
  });

  it('Should find one month from Aug 2021 to Aug 2021', () => {
    let months = usage.eachTimePeriodSince('month', '2021-08', '2021-08');
    expect(months.length).to.equal(1);
    expect(months[0]).to.equal('2021-08');
  });

  it('Should return an empty set when the end comes before the beginning', () => {
    let months = usage.eachTimePeriodSince('month', 'August 2028', 'Aug 2020');
    expect(months.length).to.equal(0);
  });
});

describe('countEntriesByProperty', () => {
  it('should correctly sum the number of same keys in an array of objects', () => {
    let output = usage.countEntriesByProperty(testData, 'user');
    expect(output.length).to.equal(5);
    expect(output[0].user).to.equal('userone');
    expect(output[0].count).to.equal(2);
    expect(output[1].user).to.equal('usertwo');
    expect(output[1].count).to.equal(1);
    expect(output[2].user).to.equal('userthree');
    expect(output[2].count).to.equal(1);
    expect(output[3].user).to.equal('studentone');
    expect(output[3].count).to.equal(1);
    expect(output[4].user).to.equal('studenttwo');
    expect(output[4].count).to.equal(1);
  });

  it('should accept an alternate label for the count property', () => {
    let opts = { countLabel: 'n' };
    let output = usage.countEntriesByProperty(testData, 'user', opts);
    expect(output.length).to.equal(5);
    expect(output[0].user).to.equal('userone');
    expect(output[0].n).to.equal(2);
    expect(output[4].n).to.equal(1);
  });

  it('should include additional fields when specified in opts', () => {
    let opts = { fieldsToRetain: ['primaryAffiliation'] };
    let output = usage.countEntriesByProperty(testData, 'user', opts);
    expect(output.length).to.equal(5);
    expect(output[0]).to.haveOwnProperty('primaryAffiliation');
    expect(output[0].primaryAffiliation).to.equal('staff');
    expect(output[4]).to.haveOwnProperty('primaryAffiliation');
    expect(output[4].primaryAffiliation).to.equal('student');
  });
});

// describe('countRepeatUsers', () => {
//   it('should correctly count repeat users in test file', () => {
//     let counts = usage.countRepeatUsers(testData);
//     expect(Object.keys(counts).length).to.equal(5);
//     expect(counts.userone.n).to.equal(2);
//     expect(counts.usertwo.n).to.equal(1);
//     expect(counts.userthree.n).to.equal(1);
//     expect(counts.studentone.n).to.equal(1);
//     expect(counts.studenttwo.n).to.equal(1);
//   });
// });

// describe('arrayFromRepeatUsers', () => {
//   input = {
//     userone: { user: 'userone', n: 4, primaryAffiliation: 'student' },
//     usertwo: { user: 'usertwo', n: 3, primaryAffiliation: 'staff' },
//   };
//   desired = [
//     { user: 'userone', n: 4, primaryAffiliation: 'student' },
//     { user: 'usertwo', n: 3, primaryAffiliation: 'staff' },
//   ];
//   let output = usage.arrayFromRepeatUsers(input);
//   expect(output).to.deep.equalInAnyOrder(desired);
// });

// describe('countDistinctValuesByProperty', () => {
//   it('should return the correct number of ', () => {
//     let testInput = [
//       { n: 1, user: 'testone' },
//       { n: 1, user: 'testtwo' },
//       { n: 3, user: 'testthree' },
//       { n: 6, user: 'testfour' },
//       { n: 3, user: 'testfive' },
//     ];
//   });
// });

describe('truncateUser', () => {
  it('should trim long usernames to 10 char by default', () => {
    let user = 'abcdefghijklmnop';
    let output = usage.truncateUser(user);
    expect(output).to.equal('abcdefghij');
  });
  it('should not trim short usernames', () => {
    let user = 'abcdefghi';
    let output = usage.truncateUser(user);
    expect(output).to.equal('abcdefghi');
  });
  it('should trim long usernames to 5 when passed a second arg of 5', () => {
    let user = 'abcdefghijklmnop';
    let output = usage.truncateUser(user, 5);
    expect(output).to.equal('abcde');
  });
});
