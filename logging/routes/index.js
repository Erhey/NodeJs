var express = require('express');
var router = express.Router();
var winston = require('../config/winston');
/* GET home page. */
router.get('/', function(req, res, next) {
  winston.error("test")
  res.render('index', { title: 'Express' });
});

module.exports = router;
 