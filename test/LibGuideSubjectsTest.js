const chai = require('chai');
// const sinon = require('sinon');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should;
const chaiArrays = require('chai-arrays');
chai.use(chaiArrays);

const LibGuideSubjects = require('../classes/LibGuideSubjects');
const lgsh = require('./samples/libapps/subj-sample');
const altsh = require('./samples/libapps/subj-sample-alt');

describe('LibGuideSubjects', () => {
  older = new LibGuideSubjects(lgsh);
  newer = new LibGuideSubjects(altsh);
  olderList = older.getList('name');
  newerList = newer.getList('name');
  it('should create an array upon construction with data', () => {
    expect(older.data).to.be.array;
    expect(newer.data).to.be.array;
    expect(older.data.length).to.equal(84);
    expect(newer.data.length).to.equal(84);
  });

  it('should return an array of strings on GetList of names', () => {
    expect(olderList).to.be.array;
    expect(olderList[0]).to.equal('Accountancy');
    expect(olderList[61]).to.equal('Media, Journalism, and Film');
    expect(newerList[61]).to.equal('Media, Journalism and Film');
  });

  it('should detect one difference between older and newer lists', () => {
    diffNone = older.missingFromSecond(olderList, olderList);
    diffMjf1 = older.missingFromSecond(olderList, newerList);
    diffMjf2 = older.missingFromSecond(newerList, olderList);
    expect(diffNone).to.be.true;
    expect(diffMjf1).to.be.array;
    expect(diffMjf1.length).to.equal(1);
    expect(diffMjf1[0]).to.equal('Media, Journalism, and Film');
    expect(diffMjf2[0]).to.equal('Media, Journalism and Film');
  });
});
