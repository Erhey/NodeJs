

let express = require('express')
let router = express.Router()
let index_controller = require('../controllers/mysqlController')
const validateToken = require('link_jwt')
router.use(validateToken('dbRequestServer'))

// Get => select data
router.get('/', index_controller.get) 
// Post => create/update/delete data
router.post('/', index_controller.post) 

module.exports = router
