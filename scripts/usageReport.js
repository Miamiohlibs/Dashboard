const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Usage = require('../classes/Usage');
const usage = new Usage();
const flags = process.argv.slice(2);
console.log(flags);

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
  if (limitByUserType) {
    data = usage.filterDataByUsertype(data, limitByUserType);
  }
  console.log('Total Usage:', data.length);
  console.log('Distinct Users:', usage.distinctUsers(data));
  console.log('Start Date: ', firstDate);

  console.log('\n' + 'Daily Stats:');
  let dailyStats = usage.getStatsByTimePeriod('day', data, firstDate);
  console.log(dailyStats);

  console.log('\n' + 'Monthly Stats:');
  let monthlyStats = usage.getStatsByTimePeriod('month', data, firstDate);
  console.log(monthlyStats);
});
