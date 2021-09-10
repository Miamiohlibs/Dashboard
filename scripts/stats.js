const Usage = require('../classes/Usage');
const usage = new Usage();
const getUsageData = require('./getUsageData');

getStats = function (options = {}) {
  let data = getUsageData();
  if (options.population) {
    data = usage.filterDataByUsertype(data, options.population);
  }

  //   let statsResults = usage.getStatsByTimePeriod(
  //     options.increment,
  //     data,
  //     options.firstDate,
  //     options.endDate
  //   );
  return data;
};

module.exports = getStats;
