const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should;
const chaiArrays = require('chai-arrays');
chai.use(chaiArrays);

const UserInfo = require('../classes/UserInfo');
const librarians = require('./samples/libapps/libn-sample');
const LibAppsDataFilterTest = require('./LibAppsDataFilterTest');
// const f = new LibAppsDataFilterTest;

const u = new UserInfo();

describe('UserInfo constructor', () => {
  it('should create an object of class UserInfo', () => {
    assert.isTrue(u instanceof UserInfo);
  });
  it('should have an empty major', () => {
    expect(u.majors).to.be.an.array();
    expect(u.majors.length).to.equal(0);
  });
  it('should have an empty course dept list', () => {
    expect(u.courseDepts).to.be.an.array();
    expect(u.courseDepts.length).to.equal(0);
  });
  it('should have an empty depts list', () => {
    expect(u.depts).to.be.an.array();
    expect(u.depts.length).to.equal(0);
  });
  it('should have an subjectData list', () => {
    expect(u.subjectData).to.be.an.array();
    expect(u.subjectData.length).to.equal(0);
  });
});

describe('UserInfo: addSubject', () => {
  beforeEach(() => {
    u.addSubject('major', 'English', { test: 'resource' });
    u.addSubject('reg', 'Psychology', { something: 'different' });
    u.addSubject('reg', 'Theatre', { somethingElse: 'different' });
    u.addSubject('dept', 'Office of the Registrar', { test: 'resource' });
  });

  it('when it adds a major, it should appear in the majors array', () => {
    expect(u.majors).to.include('English');
  });

  it('when it adds a major, its data should appear in the subjectData array', () => {
    expect(typeof u.subjectData[0]).to.equal('object');
    expect(u.subjectData[0]).to.have.property('name');
    expect(u.subjectData[0]).to.have.property('resources');
    expect(u.subjectData[0].resources).to.have.property('test');
  });

  it('when it adds a course, it should appear in the courseDepts array', () => {
    expect(u.courseDepts).to.include('Psychology');
  });

  it('when it adds a course, its data should appear in the coursesData array', () => {
    expect(typeof u.subjectData[1]).to.equal('object');
    expect(u.subjectData[1]).to.have.property('name');
    expect(u.subjectData[1].name).to.equal('Psychology');
    expect(u.subjectData[1]).to.have.property('resources');
    expect(u.subjectData[1].resources).to.have.property('something');
  });

  it('can handle multiple courses', () => {
    expect(typeof u.subjectData[2]).to.equal('object');
    expect(u.subjectData[2]).to.have.property('name');
    expect(u.subjectData[2].name).to.equal('Theatre');
    expect(u.subjectData[2]).to.have.property('resources');
    expect(u.subjectData[2].resources).to.have.property('somethingElse');
  });

  it('when it adds a dept, it should appear in the depts array', () => {
    expect(u.depts).to.include('Office of the Registrar');
  });

  it('when it adds a dept, it should add to the subjectData array', () => {
    expect(typeof u.subjectData[3]).to.equal('object');
    expect(u.subjectData[3]).to.have.property('name');
    expect(u.subjectData[3].name).to.equal('Office of the Registrar');
    expect(u.subjectData[3]).to.have.property('resources');
    expect(u.subjectData[3].resources).to.have.property('test');
  });
});
