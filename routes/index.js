var express = require('express');
var router = express.Router();
var log4js = require('log4js');
log4js.configure({
  appenders: {
    out: {
      type: 'console'
    },
    task: {
      type: 'dateFile',
      filename: './logs/',
      pattern: 'yyyyMMdd.log',
      alwaysIncludePattern:true
    }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'info'
    },
    task: {
      appenders:['task'],
      level: 'info'
    }
  }
});

const logger = log4js.getLogger('task');

/* GET home page. */
router.get('/', function(req, res, next) {
  const  tpl = require("../views/index.marko");
  try {
    // console.log = logger.info.bind(logger);
    // logger.trace('Entering cheese testing');
    // logger.debug('Got cheese.');
    // logger.info('Cheese is Gouda.');
    // logger.warn('Cheese is quite smelly.');
    // logger.error('Cheese is too ripe!');
    // logger.fatal('Cheese was breeding ground for listeria.');
    tpl.render({},res);
  }catch (err){
    console.log(err);
    next();
  }

});

module.exports = router;
