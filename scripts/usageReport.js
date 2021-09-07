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

function printMonthlyStats(firstDate, endDate = undefined) {
  months = usage.eachMonthSince(firstDate);
  for (month in months) {
    let monthData = usage.filterDataByMonth(data, months[month]);
    let monthUses = monthData.length;
    let distinctUsers = usage.distinctUsers(monthData);
    console.log(
      '* ' +
        months[month] +
        ': ' +
        monthUses +
        '\t' +
        ('Distinct users: ' + distinctUsers)
    );
  }
}

function printDailyStats(firstDate, endDate = undefined) {
  days = usage.eachDaySince(firstDate);
  for (day in days) {
    let dayData = usage.filterDataByDate(data, days[day]);
    let dayUses = dayData.length;
    let distinctUsers = usage.distinctUsers(dayData);
    console.log(
      '* ' +
        days[day] +
        ': ' +
        dayUses +
        '\t' +
        ('Distinct users: ' + distinctUsers)
    );
  }
}

file.on('close', function () {
  let firstDate = usage.getFirstDate(data); // do this before applying filters
  if (limitByUserType) {
    data = usage.filterDataByUsertype(data, limitByUserType);
  }
  console.log('Total Usage:', data.length);
  console.log('Distinct Users:', usage.distinctUsers(data));
  console.log('Start Date: ', firstDate);
  console.log('\n' + 'Monthly Stats:');
  printMonthlyStats(firstDate);

  console.log('\n' + 'Daily Stats:');
  printDailyStats(firstDate);
});
