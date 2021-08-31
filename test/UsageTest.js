const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;
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

describe('Usage: filterDataByDate', () => {
  it('Should return two entries for 31 Aug 2021', () => {
    let filtered = usage.filterDataByDate(testData, '2021-08-31');
    expect(filtered.length).to.equal(2);
  });
  it('Should return three entries for 1 Sept 2021', () => {
    let filtered = usage.filterDataByDate(testData, '2021-09-01');
    expect(filtered.length).to.equal(3);
  });
});

describe('Usage: filterDataByMonth', () => {
  it('Should return three entries for Aug 2021', () => {
    let filtered = usage.filterDataByMonth(testData, '2021-08');
    expect(filtered.length).to.equal(3);
  });
  it('Should return three entries for Sept 2021', () => {
    let filtered = usage.filterDataByMonth(testData, 'Sep 2021');
    expect(filtered.length).to.equal(3);
  });
});

describe('Usage: filterDataByYear', () => {
  it('Should return six entries for 2021', () => {
    let filtered = usage.filterDataByYear(testData, '2021');
    expect(filtered.length).to.equal(6);
  });
  it('Should return zero entries for 2020', () => {
    let filtered = usage.filterDataByYear(testData, '2020');
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

describe('Usage: eachMonthSince', () => {
  it('Should find eight months from Jan-Aug 2021', () => {
    let months = usage.eachMonthSince('Jan 2021', 'Aug 2021');
    expect(months.length).to.equal(8);
    expect(months[0]).to.equal('2021-01');
    expect(months[3]).to.equal('2021-04');
    expect(months[7]).to.equal('2021-08');
  });

  it('Should find one month from Aug 2021 to Aug 2021', () => {
    let months = usage.eachMonthSince('2021-08', '2021-08');
    expect(months.length).to.equal(1);
    expect(months[0]).to.equal('2021-08');
  });

  it('Should return an empty set when the end comes before the beginning', () => {
    let months = usage.eachMonthSince('August 2028', 'Aug 2020');
    expect(months.length).to.equal(0);
  });
});
