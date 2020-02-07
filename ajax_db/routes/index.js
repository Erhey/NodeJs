let express = require('express')
let router = express.Router()
let mysql_controller = require('../controllers/MysqlController')
let mongoDb_controller = require('../controllers/MongoDbController')
const validateToken = require('link_jwt')

// routes are defined by Database name
router.post('/wamp', validateToken('mysql_crud'), mysql_controller.exec)
router.post('/tracking', validateToken('mongo_crud'), mongoDb_controller.exec)
router.post('/jwt', validateToken('mongo_jwt'), mongoDb_controller.exec)
router.post('/galaxy_breaker', validateToken('galaxy_breaker'), mysql_controller.exec)

module.exports = router
