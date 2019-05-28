var express = require('express')
var router = express.Router()
router.get('/cool/', function (req, res, next) {
	res.render('userCool')
})


router.get('/', function (req, res, next) {
	res.send("Hey Bro")
})
module.exports = router; 