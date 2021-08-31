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
