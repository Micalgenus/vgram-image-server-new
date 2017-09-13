/**
 * Created by Seon-ho on 2017-09-14.
 */
"use strict";

const morgan = require('morgan'),
  winston = require('winston'),
  moment = require('moment'),

  fs = require('fs');

var config = require('../config/main');

winston.emitErrs = true;

let logDir = config.LOG_DIR || "logs";
if ( !fs.existsSync( logDir ) ) {
  // Create the directory if it does not exist
  fs.mkdirSync( logDir );
}

// logging level : { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      name: 'info-file',
      level: 'info',
      filename: './' + logDir + '/info-logs-' + moment().format('YYYYMMDDHHmm') + "-pid_" + process.pid + '.log',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false,
      timestamp: function(){
        return moment().format("YYYY-MM-DD HH:mm:ss.SSS");
      }
    }),
    new winston.transports.Console({
      name: 'debug-file',
      level: 'debug',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: false,
      colorize: true,
      timestamp: function(){
        return moment().format("YYYY-MM-DD HH:mm:ss.SSS");
      }
    }),
    new winston.transports.File({
      name: 'error-file',
      filename: './' + logDir + '/error-logs-' + moment().format('YYYYMMDDHHmm') + "-pid_" + process.pid + '.log',
      level: 'error',
      humanReadableUnhandledException: true,
      json: true,
      colorize: false,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      timestamp: function(){
        return moment().format("YYYY-MM-DD HH:mm:ss.SSS");
      }
    })
  ],
  exitOnError: false
});

logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;
