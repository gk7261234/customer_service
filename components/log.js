/**
 * Created by GK on 2017/9/22.
 */
var log4js = require('log4js');
var config = require('../config/log4js.json');
log4js.configure(config);

var logger = log4js.getLogger("log_file");
var logger1 = log4js.getLogger('log_date');
logger.info("this is a log4js111111!");
logger1.info("this is a log4js test11111111111111111");
console.log("test test!");