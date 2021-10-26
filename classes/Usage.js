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
  filterByDataByDateRange(data, startDate, endDate = undefined) {
    startDate = dayjs(startDate).startOf().format();
    endDate = dayjs(endDate).add(1, 'day').startOf().format();
    return data.filter((i) => i.time > startDate && i.time < endDate);
  }
  filterDataByDate(data, date, unit) {
    let dateFormat = this.getDateFormatForUnit(unit);
    let dateStr = dayjs(date).format(dateFormat);
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
    let periods = this.eachTimePeriodSince(unit, startDate, endDate);
    let output = [];

    for (let period in periods) {
      let periodData = this.filterDataByDate(data, periods[period], unit);
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

  countRepeatUsers(data) {
    const counts = {};
    data.forEach((entry) => {
      let userId = entry.user;
      let n;
      if (counts[userId] !== undefined) {
        n = counts[userId]['n'] + 1;
      } else {
        n = 1;
      }
      let affil = entry.primaryAffiliation;
      counts[userId] = { user: userId, n: n, primaryAffiliation: affil };
    });
    return counts;
  }

  truncateUser(input, length = 10) {
    return input.substring(0, length);
  }
};
