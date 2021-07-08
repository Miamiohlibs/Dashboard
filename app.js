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
var bodyParser = require('body-parser');
var path = require('path');

// console.log(process.env.HOSTNAME); // ulblwebt03.lib.miamioh.edu = prod
if (process.env.HOSTNAME === 'ulblwebt03.lib.miamioh.edu') {
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
  res.render('dashboard', { user: userInfo });
});

app.get('/json', async (req, res) => {
  var userInfo = await handleRequest(req);
  res.send(userInfo);
});

app.get('/preview', async (req, res) => {
  if (req.query.subject) {
    var userInfo = await handleRequest(req);
    res.render('dashboard', { user: userInfo });
  } else {
    subjects = require('./models/subjCodes');
    res.render('preview', { subjects: subjects });
  }
});

if (global.onServer === true) {
  app.get('/logout', function (req, res, next) {
    // Do whatever you like here, then call the logout middleware
    casClient.logout()(req, res, next);
  });
}
const PORT = process.env.PORT || config.get('app.port');

if (global.onServer === true) {
  const server = {
    key: '/etc/ssl/certs/ulblwebt03.lib.miamioh.edu.key',
    cert: '/etc/ssl/certs/ulblwebt03.lib.miamioh.edu.crt',
  };

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
        `Example app listening on port ${PORT}! Go to https://localhost:${PORT}/`
      );
    });
} else {
  app.listen(PORT, function () {
    console.log(
      `Example app listening on port ${PORT}! Go to http://localhost:${PORT}/`
    );
  });
}
