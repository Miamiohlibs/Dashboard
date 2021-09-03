const databases = require('../cache/Databases');
const subjects = require('../cache/Subjects');
const librarians = require('../cache/Librarians');
const guides = require('../cache/Guides');
const LibAppsDataFilter = require('./LibAppsDataFilter');
const { major } = require('../models/codeMap');
const f = new LibAppsDataFilter();

module.exports = class UserInfo {
  constructor() {
    this.courseDepts = [];
    this.majors = [];
    this.depts = [];
    this.liaisons = [];
    this.subjectData = [];
  }
  addSubject(subjType, subject, resources) {
    this.subjectData.push({ name: subject, resources: resources });
    switch (subjType) {
      case 'major':
        this.majors.push(subject);
        break;
      case 'dept':
        this.depts.push(subject);
        break;
      case 'reg':
        this.courseDepts.push(subject);
        break;
      case 'liaison':
        this.liaisons.push(subject);
    }
  }
};
