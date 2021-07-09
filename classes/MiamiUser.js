/*
  This class ingests JSON data from CAS and returns it as a handful of properties for easier access
  so we don't have to worry about using the long, complicated CAS attribute names
*/

module.exports = class MiamiUser {
  constructor(casData) {
    if (casData === undefined) {
      return;
    } else {
      this.casObject = casData;
      let attr = this.casObject.attributes;
      this.setIfExists('uid', attr.uid[0]); // string
      this.setIfExists('majors', attr.muohioeduMajor); // array
      this.setIfExists('majorCodes', attr.muohioeduMajorCode); // array
      this.setIfExists(
        'courseNumbers',
        attr.muohioeduCurrentCourseSubjectNumber
      ); //array
      this.setIfExists('primaryCampus', attr.muohioeduPrimaryLocation[0]); // string
      this.setIfExists(
        'primaryAffiliation',
        attr.eduPersonPrimaryAffiliation[0]
      ); //string
      this.setIfExists('name', attr.displayName[0]); // string
      this.setIfExists('givenName', attr.givenName[0]); // string
      this.setIfExists('courseCRNs', attr.muohioeduCurrentCourseCRN); // array
      this.setIfExists('colleges', attr.muohioeduCollege); // array
      this.setIfExists(
        'primaryAffiliationCode',
        attr.muohioeduPrimaryAffiliationCode[0]
      ); //string
      this.setIfExists('departments', attr.muohioeduDepartment);
      this.setIfExists('departmentCodes', attr.muohioeduDepartmentCode);
      this.setIfExists(
        'teachingCourses',
        attr.muohioeduCurrentTeachingSubjectNumber
      );
      /*
        For these next two, I'm not sure why we can't pass 
        this.courseNumbers and this.teachingCourses
        as arguments, but that gets an error; so we do it the way it works
      */
      if (this.courseNumbers) {
        this.courseDeptCodes = this.getCourseDeptCodes(
          attr.muohioeduCurrentCourseSubjectNumber
        );
      }
      if (this.teachingCourses) {
        this.teachingDeptCodes = this.getCourseDeptCodes(
          attr.muohioeduCurrentTeachingSubjectNumber
        );
      }
      if (this.colleges !== undefined) {
        this.college = this.colleges[0]; // string
      }
      if (attr.muohioeduClass !== undefined) {
        this.class = attr.muohioeduClass[0]; //string
      }
    }
  }

  setIfExists(thisAttrLabel, value) {
    if (value !== '' && value !== undefined) {
      this[thisAttrLabel] = value;
    }
  }

  getCourseDeptCodes(n) {
    let codes = n.map((x) => {
      let dept = x.match(/^[A-Z]+/);
      return dept[0];
    });
    //return codes;
    return [...new Set(codes)];
  }
};
