var express = require('express')
var router = express.Router()
let jwtController = require("../jwt/jwtController")

/* GET home page. */
router.get('/getAccessToken', function(req, res, next) {
  req.body.login = "test7"
  req.body.password = "test"
  jwtController.getAccessToken(req, res, result => {
    res.send(result)
  })
})

module.exports = router
