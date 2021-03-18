module.exports = class LibGuideSubjects {
  constructor(data) {
    this.data = data;
  }

  getList(propName) {
    let list = [];
    this.data.forEach((el) => {
      list.push(el.name);
    });
    return list;
  }

  missingFromSecond(a1, a2) {
    /* returns a list of items missing from the second arg*/
    if (JSON.stringify(a1) == JSON.stringify(a2)) {
      return true;
    }
    let diff = a1.filter((item) => {
      return !a2.includes(item); // return if item is not in second list
    });
    return diff;
  }
};
