var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
const dburi = 'mongodb://localhost/personal';
const connection = mongoose.connection;
connection.once('open', () => {
  console.log(`[mongo] <${connection.db.databaseName}> connect success.`);
})
connection.once('close', () => {
  console.log(`[mongo] <${connection.db.databaseName}> close success.`);
})
connection.on('error', console.error.bind(console, `[mongo] connect error.\n`))
mongoose.connect(dburi);

const middle = require('./routes/middle');
var index = require('./routes/index');
var user = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app', 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser('soonfy'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: 'soonfy',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  },
  saveUninitialized: false, // don't create session until something stored
  resave: true, // don't save session if unmodified
  store: new MongoStore({
    mongooseConnection: connection,
    collection: 'owner_sessions',
    ttl: 14 * 24 * 60 * 60, // 14days
    autoRemove: 'native' // 自动移除过期session
  })
}))

app.use('/', index);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
