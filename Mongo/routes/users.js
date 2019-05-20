var express = require('express')
var router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("test")
})

router.get('/cool/', function (req, res, next) {
	res.render('userCool')
})


module.exports = router;
