const dayjs = require('dayjs');

module.exports = class Usage {
  getDates(data) {
    return data.map((i) => i.time).sort();
  }
  getFirstMonth(data) {
    let dates = this.getDates(data);
    return dayjs(dates[0]).format('YYYY-MM');
  }
  getFirstDate(data) {
    let dates = this.getDates(data);
    return dayjs(dates[0]).format('YYYY-MM-DD');
  }
  filterDataByDate(data) {
    return false;
  }
  filterDataByMonth(data) {
    return false;
  }
  filterDataByUsertype(data) {
    return false;
  }
};
