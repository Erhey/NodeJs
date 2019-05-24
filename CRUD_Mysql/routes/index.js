

let express = require('express');
let router = express.Router();

let index_controller = require("../controllers/indexController")

/* GET users listing. */


router.get('/', index_controller.index) 
router.get('/unauthorized', index_controller.unauthorized) 
router.post('/login', index_controller.login_post) 
router.get('/login', index_controller.login_get) 

module.exports = router;
