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
  filterDataByDate(data, date) {
    let dateStr = dayjs(date).format('YYYY-MM-DD');
    return data.filter((i) => i.time.includes(dateStr));
  }
  filterDataByMonth(data, month) {
    let dateStr = dayjs(month).format('YYYY-MM');
    return data.filter((i) => i.time.includes(dateStr));
  }
  filterDataByYear(data, year) {
    let dateStr = dayjs(year).format('YYYY');
    return data.filter((i) => i.time.includes(dateStr));
  }
  filterDataByUsertype(data) {
    return false;
  }
};
