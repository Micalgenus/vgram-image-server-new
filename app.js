var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var logger = require('./utils/logger');
var errorhandler = require('errorhandler');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var index = require('./controllers/index');
var config = require("./config/main");

var app = express();

var env = process.env.NODE_ENV || "development";
app.set('env', env);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '150mb',
    parameterLimit: 100000000, // experiment with this parameter and tweak
    extended: true,
    secret: config.secret
}));
app.use(cookieParser());
app.use(express.static(__dirname + "/" + config.resource.DIR));
// app.use('/medias', express.static(path.join(__dirname, config.resource.MEDIAS_DIR)));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (app.get('env') === 'production') {
  app.use(morgan("combined", {"stream": logger.stream}));
}

if (app.get('env') === 'development') {
  app.use(morgan('dev'));   // 고로, 4.X 버전에서는 morgan을 사용해야 함. logger와 같은 역할
  app.use(errorhandler());
}

module.exports = app;
