

let express = require('express')
let router = express.Router()
let mysql_controller = require('../controllers/MysqlController')
let mongoDb_controller = require('../controllers/MongoDbController')
const validateToken = require('link_jwt')
// router.use(validateToken('dbRequestServer'))


// // MYSQL WAMP 
// router.get('/c0r', validateToken('access_db_c0rw', 'access_db_c0r'), mysql_controller.get) 
// router.post('/c0w', validateToken('access_db_c0rw', 'access_db_c0w'), mysql_controller.post) 

// // mongodb -> CRUD-MYSQL
// router.get('/c1r', validateToken('access_db_c1rw', 'access_db_c1r'), mongoDb_controller.get) 
// router.post('/c1w', validateToken('access_db_c1rw', 'access_db_c1w'), mongoDb_controller.post) 

// // mongodb -> authentication
// router.get('/c2r', validateToken('access_db_c2rw', 'access_db_c2r'), mongoDb_controller.get) 
// router.post('/c2w', validateToken('access_db_c2rw', 'access_db_c2w'), mongoDb_controller.post) 

router.post('/c0', validateToken('access_db_c0rw'), mysql_controller.exec)
router.post('/c1', validateToken('access_db_c1rw'), mysql_controller.exec)
router.post('/c2', validateToken('access_db_c2rw'), mysql_controller.exec)


// // Get => select data
// router.get('/3', validateToken('access_db_c3rw', 'access_db_c3r'), mysql_controller.get) 
// // Post => create/update/delete data
// router.post('/3', validateToken('access_db_c3rw', 'access_db_c3w'), mysql_controller.post) 








module.exports = router
