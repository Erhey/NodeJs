const express = require('express')
const router = express.Router()
const indexController = require("../controllers/IndexController")
router.get('/', indexController.index)

router.get('/login', indexController.login_get)
router.post('/login', indexController.login_post)
module.exports = router; 