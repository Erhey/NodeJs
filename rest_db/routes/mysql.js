

let express = require('express');
let router = express.Router();
let index_controller = require("../controllers/mysqlController")
const jwtAuth = require('link_jwt')
router.use(jwtAuth.checkAccessToken)

/* GET users listing. */
router.get('/', index_controller.get) 
router.post('/', index_controller.post) 
// router.put('/', index_controller.put) 
// router.delete('/', index_controller.delete) 

module.exports = router;
