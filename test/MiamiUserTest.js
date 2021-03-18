// const fs = require('fs');
// const path = require('path');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should;
const MiamiUser = require('../classes/MiamiUser.js');

const ken = require('./samples/users/ken.js');
const student1 = require('./samples/users/stu1');
const faculty1 = require('./samples/users/fac1');
const carl = require('./samples/users/carl.js');
// const { user } = require('./samples/users/stu1');
let userKen = new MiamiUser(ken);
let userCarl = new MiamiUser(carl);
let userStu1 = new MiamiUser(student1);
let userNull = new MiamiUser();
let userFac1 = new MiamiUser(faculty1);

describe('MiamiUser Variables', function () {
  it('should return object', () => {
    assert.typeOf(userKen, 'object');
  });

  it('should return type MiamiUser', () => {
    assert.isTrue(userKen instanceof MiamiUser);
  });

  it('should define casObject from original data', () => {
    expect(userKen).to.have.property('casObject');
  });

  it('should know the uid', () => {
    assert.equal(userKen.uid, 'irwinkr');
  });

  it('should NOT find an academic major for ken', () => {
    expect(userKen).to.not.have.property('major');
  });

  it('should find an academic major for carl', () => {
    expect(userCarl).to.have.property('majors');
  });

  it('should have an array size 1 for carl majors', () => {
    expect(userCarl.majors).to.be.an('Array');
    assert.equal(userCarl.majors.length, 1);
    assert.equal(userCarl.majors[0], 'Mechanical Engineering');
  });

  it('should have a majorCodes attribute for carl == [apme]', () => {
    expect(userCarl.majorCodes).to.be.an('Array');
    assert.equal(userCarl.majorCodes[0], 'apme');
  });

  it('should have a have four current courses for Carl', () => {
    expect(userCarl.courseNumbers).to.be.an('Array');
    assert.equal(userCarl.courseNumbers.length, 4);
    assert.equal(userCarl.courseNumbers[0], 'MME313');
  });

  it('should have a have four current courseCRNs for Carl', () => {
    expect(userCarl.courseCRNs).to.be.an('Array');
    assert.equal(userCarl.courseCRNs.length, 4);
    assert.equal(userCarl.courseCRNs[0], '20202074503');
  });

  it('should have a primary campus of Oxford for carl', () => {
    assert.equal(userCarl.primaryCampus, 'Oxford');
  });

  it('should have colleges = array length 1 for carl', () => {
    expect(userCarl.colleges).to.be.an('Array');
    assert.equal(userCarl.colleges.length, 1);
  });

  it('should have college = Col of Engineering & Computing for carl', () => {
    assert.equal(userCarl.college, 'Col of Engineering & Computing');
  });

  it('should have a primary affiliation of student for carl', () => {
    assert.equal(userCarl.primaryAffiliation, 'student');
  });

  it('should have a primary affiliation of student for ken', () => {
    assert.equal(userKen.primaryAffiliation, 'staff');
  });

  it('should know kens names', () => {
    assert.equal(userKen.name, 'Mr. Kenneth R Irwin');
    assert.equal(userKen.givenName, 'Kenneth');
  });

  it('should know that carl is a junior', () => {
    assert.equal(userCarl.class, 'Junior');
  });

  it('should know that carl is primarily an undergrad', () => {
    assert.equal(userCarl.primaryAffiliationCode, 'und');
  });

  it('should know that ken is primarily staff', () => {
    assert.equal(userKen.primaryAffiliationCode, 'sta');
  });

  it('should know carls course departments are MME & ENG', () => {
    expect(userCarl.courseDeptCodes).to.be.an.array();
    expect(userCarl.courseDeptCodes.length).to.equal(2);
    expect(userCarl.courseDeptCodes).to.include('MME');
    expect(userCarl.courseDeptCodes).to.include('ENG');
  });

  it('should not find any course departments for ken', () => {
    expect(userKen.courseDeptCodes).to.equal(undefined);
  });
  it('should find a department for the fac1', () => {
    expect(userFac1).to.haveOwnProperty('departments');
    expect(userFac1.departments[0]).to.equal('Educational Psychology');
  });
  it('should find a department code for the fac1', () => {
    expect(userFac1).to.haveOwnProperty('departmentCodes');
    expect(userFac1.departmentCodes[0]).to.equal('edp');
  });
  it('should find NOT a department for stu1', () => {
    expect(userStu1).not.to.haveOwnProperty('department');
  });
  it('should find NOT a department code for the stu1', () => {
    expect(userStu1).not.to.haveOwnProperty('departmentCode');
  });
  it('should be know about classes a faculty member is teaching', () => {
    expect(userFac1).to.haveOwnProperty('teachingCourses');
    expect(userFac1.teachingCourses.length).to.equal(2);
    expect(userFac1.teachingCourses.includes('ENG111')).to.be.true;
    expect(userFac1.teachingCourses.includes('CJS245')).to.be.true;
    expect(userFac1.teachingCourses.includes('ENG101')).to.be.false;
  });
  it('should be know in what depts a faculty member teaching', () => {
    expect(userFac1).to.haveOwnProperty('teachingDeptCodes');
    expect(userFac1.teachingDeptCodes.length).to.equal(2);
    expect(userFac1.teachingDeptCodes.includes('ENG')).to.be.true;
    expect(userFac1.teachingDeptCodes.includes('CJS')).to.be.true;
    expect(userFac1.teachingDeptCodes.includes('BIO')).to.be.false;
  });
});

describe('MiamiUser: setIfExists', () => {
  it('should setIfExists a string', () => {
    userStu1.setIfExists('bogusString', 'bobsyeruncle');
    expect(userStu1).to.haveOwnProperty('bogusString');
    expect(userStu1.bogusString).to.equal('bobsyeruncle');
  });
  it('should setIfExists an array', () => {
    userStu1.setIfExists('bogusArray', [1, 2, 3]);
    expect(userStu1).to.haveOwnProperty('bogusArray');
    expect(userStu1.bogusArray.length).to.equal(3);
  });
  it('should setIfExists nothing on empty string', () => {
    userStu1.setIfExists('nuthin', '');
    expect(userStu1).not.to.haveOwnProperty('nuthin');
  });
  it('should setIfExists nothing on undefined', () => {
    userStu1.setIfExists('nuthin', undefined);
    expect(userStu1).not.to.haveOwnProperty('nuthin');
  });
});

describe('MiamiUser: Null user', () => {
  it('should return type MiamiUser', () => {
    assert.isTrue(userNull instanceof MiamiUser);
  });
});
