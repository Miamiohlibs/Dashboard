module.exports = (subjStr) => {
  let [codeType, codeVal] = subjStr.split('---');

  subjUser = {
    fakeCas: {
      user: subjStr,
      attributes: {
        uid: ['fakeuid'],
        givenName: [subjStr],
        displayName: [subjStr],
        muohioeduPrimaryLocation: ['Oxford'],
        muohioeduPrimaryLocationCode: ['oxf'],
      },
    },
  };

  if (codeType == 'majorCode') {
    subjUser.fakeCas.attributes.eduPersonPrimaryAffiliation = ['student'];
    subjUser.fakeCas.attributes.muohioeduPrimaryAffiliationCode = ['stu'];
    subjUser.fakeCas.attributes.muohioeduMajorCode = [codeVal];
  } else {
    subjUser.fakeCas.attributes.eduPersonPrimaryAffiliation = ['faculty'];
    subjUser.fakeCas.attributes.muohioeduPrimaryAffiliationCode = ['fac'];
    if (codeType == 'regCode') {
      subjUser.fakeCas.attributes.muohioeduCurrentCourseSubjectNumber = [
        codeVal + '101',
      ];
    } else if (codeType == 'deptCode') {
      subjUser.fakeCas.attributes.muohioeduDepartmentCode = codeVal;
    }
  }

  return subjUser;
};
