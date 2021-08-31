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
  filterDataByUsertype(data, usertype) {
    return data.filter((i) => i.primaryAffiliation == usertype);
  }
  distinctUsers(data) {
    return [...new Set(data.map((i) => i.user))].length;
  }
  eachMonthSince(startDate, endDate = undefined) {
    if (dayjs(endDate) < dayjs(startDate)) {
      return [];
    }
    let endMonth = dayjs(endDate).format('YYYY-MM'); //defaults to now if not specified
    let month = dayjs(startDate).format('YYYY-MM'); //start with input date's month
    let done = false;
    let months = [];
    while (done == false) {
      months.push(month);
      if (month == endMonth) {
        done = true;
      } else {
        month = dayjs(month).add(1, 'month').format('YYYY-MM');
      }
    }
    return months;
  }
};
