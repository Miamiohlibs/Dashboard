const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Usage = require('../classes/Usage');
const usage = new Usage();
const flags = process.argv.slice(2);
const dayjs = require('dayjs');
// console.log(flags);

let limitByUserType = false;
if (flags.includes('--student') || flags.includes('--students')) {
  limitByUserType = 'student';
} else if (flags.includes('--faculty')) {
  limitByUserType = 'faculty';
} else if (flags.includes('--staff')) {
  limitByUserType = 'staff';
}
if (limitByUserType) {
  console.log('Limiting Data to User Type: ' + limitByUserType);
}

let statsIncrements = ['day', 'month', 'year'];
if (flags.includes('--day-only')) {
  statsIncrements = ['day'];
} else if (flags.includes('--month-only')) {
  statsIncrements = ['month'];
} else if (flags.includes('--year-only')) {
  statsIncrements = ['year'];
}

let startDate;
// Find startDate and endDate flags if any
let res = flags.findIndex((i) => i.includes('--start-date='));
if (res >= 0) {
  startFlag = flags[res];
  startArr = startFlag.split('=');
  startDate = startArr[1];
}

let endDate;
// Find endDate and endDate flags if any
res = flags.findIndex((i) => i.includes('--end-date='));
if (res >= 0) {
  startFlag = flags[res];
  startArr = startFlag.split('=');
  endDate = startArr[1];
}

// Creating a readable stream from file
// readline module reads line by line
// but from a readable stream only.
const file = readline.createInterface({
  input: fs.createReadStream(
    path.join(__dirname, '..', 'logs', 'usageLog.txt')
  ),
  output: process.stdout,
  terminal: false,
});

// Printing the content of file line by
//  line to console by listening on the
// line event which will triggered
// whenever a new line is read from
// the stream

let data = [];

file.on('line', (line) => {
  try {
    let obj = JSON.parse(line);
    data.push(obj);
  } catch (err) {}
});

file.on('close', function () {
  let firstDate = usage.getFirstDate(data); // do this before applying filters

  // allow user defined startDate if it's greater than first available date
  if ((startDate != undefined) & (dayjs(startDate) > dayjs(firstDate))) {
    firstDate = startDate;
  }

  if (limitByUserType) {
    data = usage.filterDataByUsertype(data, limitByUserType);
  }
  data = usage.filterByDataByDateRange(data, firstDate, endDate);
  console.log('Total Usage:', data.length);
  console.log('Distinct Users:', usage.distinctUsers(data));
  console.log('Start Date: ', firstDate);
  console.log('End Date: ', endDate);

  for (increment in statsIncrements) {
    incrementName = statsIncrements[increment];
    console.log('\n' + `Stats by ${incrementName}:`);
    let statsResults = usage.getStatsByTimePeriod(
      incrementName,
      data,
      firstDate,
      endDate
    );
    console.log(statsResults);
  }
});
