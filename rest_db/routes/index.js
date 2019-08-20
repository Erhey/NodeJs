

let express = require('express')
let router = express.Router()
let index_controller = require('../controllers/mysqlController')
const validateToken = require('link_jwt')
// router.use(validateToken('dbRequestServer'))


// Get => select data
router.get('/c0r', validateToken('access_db_c0rw', 'access_db_c0r'), index_controller.get) 
// Post => create/update/delete data
router.post('/c0w', validateToken('access_db_c0rw', 'access_db_c0w'), index_controller.post) 

// Get => select data
router.get('/c1r', validateToken('access_db_c1rw', 'access_db_c1r'), index_controller.get) 
// Post => create/update/delete data
router.post('/c1w', validateToken('access_db_c1rw', 'access_db_c1w'), index_controller.post) 

// Get => select data
router.get('/c2r', validateToken('access_db_c2rw', 'access_db_c2r'), index_controller.get) 
// Post => create/update/delete data
router.post('/c2w', validateToken('access_db_c2rw', 'access_db_c2w'), index_controller.post) 

// // Get => select data
// router.get('/3', validateToken('access_db_c3rw', 'access_db_c3r'), index_controller.get) 
// // Post => create/update/delete data
// router.post('/3', validateToken('access_db_c3rw', 'access_db_c3w'), index_controller.post) 




router.get('/2', index_controller.get) 




module.exports = router
