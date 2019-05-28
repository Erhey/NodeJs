var express = require('express')
var router = express.Router()

router.get('/users', function (req, res, next) {
	res.send('userCool')
})
router.get('/', function (req, res, next) {
	res.send("Hey Bro")
})
module.exports = router; 