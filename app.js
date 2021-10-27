/*
based on:
https://www.npmjs.com/package/node-cas-client
https://github.com/zimplexing/node-cas-client
*/
require('dotenv').config();
const config = require('config');
const https = require('https');
const fs = require('fs');
const express = require('express');
const encoder = require('./classes/PercentEncodeString');
const handleRequest = require('./scripts/handleRequest');
const createFakeSubjUser = require('./scripts/createFakeSubjUser');
var bodyParser = require('body-parser');
var path = require('path');
const usageLog = require('./scripts/usageLog');
getUsageData = require('./scripts/getUsageData');

// console.log(process.env.HOSTNAME); // ulblwebp11.lib.miamioh.edu = prod
if (process.env.ON_SERVER === 'true') {
  global.onServer = true;
} else {
  global.onServer = false;
}
console.log(`On Server? : ${global.onServer}`);

const session = require('express-session');
const cookieParser = require('cookie-parser');
const MemoryStore = require('session-memory-store')(session);

const app = express();

app.use(cookieParser());

if (global.onServer === true) {
  app.use(
    session({
      name: config.get('CAS.sessionName'),
      secret: config.get('CAS.secret'),
      store: new MemoryStore(), // or other session store
    })
  );
}

const casClient = require('./middleware/cas-client');
const { Html5Entities } = require('html-entities');
const { userInfo } = require('os');
app.locals.encoder = new encoder();

if (global.onServer === true) {
  app.use(casClient.core());
}

// NOTICE: If you want to enable single sign logout, you must use casClient middleware before bodyParser.
/*
I think we can skip these two lines in favor of the native express body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
*/

app.use(express.static(path.resolve(__dirname, 'public')));
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  var userInfo = await handleRequest(req);
  let settings = {};
  if (config.has('feedbackForm')) {
    settings.feedbackForm = config.get('feedbackForm');
  }
  res.render('dashboard', { user: userInfo, settings: settings });
  usageLog(userInfo);
});

app.get('/json', async (req, res) => {
  var userInfo = await handleRequest(req);
  res.send(userInfo);
});

app.get('/preview', async (req, res) => {
  if (req.query.subject) {
    subjUser = createFakeSubjUser(req.query.subject);
    var userInfo = await handleRequest(subjUser);
    if (req.query.json) {
      res.send(userInfo);
    } else {
      res.render('dashboard', { user: userInfo });
    }
  } else {
    subjects = require('./models/subjCodes');
    oxfordSubj = subjects.filter((s) => s.regional != true);
    res.render('preview', { subjects: oxfordSubj });
  }
});

/* Graphing and stats Routes */

app.get('/graph', (req, res) => {
  res.render('graph');
});

app.get('/usageData', async (req, res) => {
  // set default params
  let increment = req.query.increment || 'month';
  if (!req.query.startDate) {
    req.query.startDate = '2021-09-02';
  }

  // get data
  data = getUsageData();
  const usageReport = require('./scripts/usageReport2');
  let stats = usageReport(data, increment, req.query);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(stats));
});

app.get('/repeatUsers', async (req, res) => {
  data = getUsageData();
  const repeatUsers = require('./scripts/repeatUsers');
  let allSummary = repeatUsers(data, { startDate: '2021-09-02' });
  let facSummary = repeatUsers(data, {
    population: 'faculty',
    startDate: '2021-09-02',
  });
  let staffSummary = repeatUsers(data, {
    population: 'staff',
    startDate: '2021-09-02',
  });
  let stuSummary = repeatUsers(data, {
    population: 'student',
    startDate: '2021-09-02',
  });
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      student: stuSummary,
      faculty: facSummary,
      staff: staffSummary,
      all: allSummary,
    })
  );
});

app.get('/stats', async (req, res) => {
  data = getUsageData();
  const usageReport = require('./scripts/usageReport2');
  let dayStats = usageReport(data, 'day', { startDate: '2021-09-02' });
  let monthStats = usageReport(data, 'month', { startDate: '2021-09-02' });
  let monthStuStats = usageReport(data, 'month', {
    startDate: '2021-09-02',
    population: 'student',
  });
  let dayStuStats = usageReport(data, 'day', {
    startDate: '2021-09-02',
    population: 'student',
  });
  res.render('stats', {
    monthStats: JSON.stringify(monthStats.details),
    dayStats: JSON.stringify(dayStats.details, null, 2),
    monthStuStats: JSON.stringify(monthStuStats.details),
    dayStuStats: JSON.stringify(dayStuStats.details, null, 2),
  });
});

if (global.onServer === true) {
  app.get('/logout', function (req, res, next) {
    // Do whatever you like here, then call the logout middleware
    casClient.logout()(req, res, next);
  });
}
const PORT = process.env.PORT || config.get('app.port');

if (global.onServer === true) {
  const server = config.get('app.server');

  https
    .createServer(
      {
        key: fs.readFileSync(server.key),
        cert: fs.readFileSync(server.cert),
      },
      app
    )
    .listen(PORT, function () {
      console.log(
        `Server app listening on port ${PORT}! Go to https://${process.env.HOSTNAME}:${PORT}/`
      );
    });
} else {
  app.listen(PORT, function () {
    console.log(
      `Localhost app listening on port ${PORT}! Go to http://localhost:${PORT}/`
    );
  });
}
