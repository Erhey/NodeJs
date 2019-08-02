const auth = require('../middlewares/jwt_auth')
const express = require('express')
let index_controller = require("../controllers/indexController")
const router = express.Router()

router.get('/', auth, index_controller.get)

module.exports = router