let express = require('express')
let router = express.Router()
let mysql_controller = require('../controllers/MysqlController')
let mongoDb_controller = require('../controllers/MongoDbController')
const validateToken = require('link_jwt')

// routes are defined by Database name
router.post('/wamp', validateToken('Audience: mysql_crud'), mysql_controller.exec)
router.post('/tracking', validateToken('Audience: mongo_crud'), mongoDb_controller.exec)
router.post('/jwt', validateToken('Audience: mongo_jwt'), mongoDb_controller.exec)

module.exports = router
