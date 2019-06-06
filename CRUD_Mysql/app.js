var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userMngRouter = require('./routes/userMng');
const tracker = require("./track/tracker")


var app = express();
// Gestion du tracking
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", (req, res, next) => tracker.track(req, res, next))

app.use('/', indexRouter);
app.use('/UserMng', userMngRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.statusCode = 404
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.error = {}
  res.error.message = err.message
  res.error.status = res.statusCode
  res.error.level = "Fatal"
  res.error.detail = "Une erreur est survenu lors de la recherche de res"
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app; 