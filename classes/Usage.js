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
  getDateFormatForUnit(unit) {
    let dateFormat;
    switch (unit) {
      case 'day':
        dateFormat = 'YYYY-MM-DD';
        break;
      case 'month':
        dateFormat = 'YYYY-MM';
        break;
      case 'year':
        dateFormat = 'YYYY';
        break;
    }
    return dateFormat;
  }
  eachTimePeriodSince(unit, startDate, endDate = undefined) {
    if (dayjs(endDate) < dayjs(startDate)) {
      return [];
    }
    let dateFormat = this.getDateFormatForUnit(unit);
    let endTimePeriod = dayjs(endDate).format(dateFormat); //defaults to now if not specified
    let timePeriod = dayjs(startDate).format(dateFormat); //start with input date's month
    let done = false;
    let entries = [];
    while (done == false) {
      entries.push(timePeriod);
      if (timePeriod == endTimePeriod) {
        done = true;
      } else {
        timePeriod = dayjs(timePeriod).add(1, unit).format(dateFormat);
      }
    }
    return entries;
  }
  getStatsByTimePeriod(unit, data, startDate, endDate = undefined) {
    let periods = this.eachTimePeriodSince(unit, startDate);
    let output = [];
    console.log(periods.length);
    for (let period in periods) {
      let periodData = this.filterDataByDate(data, periods[period]);
      let periodUses = periodData.length;
      let periodDistinctUsers = this.distinctUsers(periodData);
      let entry = {
        period: periods[period],
        periodUses: periodUses,
        periodDistinctUsers: periodDistinctUsers,
      };
      output.push(entry);
    }
    return output;
  }
};
