

let express = require('express');
let router = express.Router();

let index_controller = require("../controllers/indexController")

/* GET users listing. */


router.get('/', index_controller.index) 
router.post('/multiconnectionsAt', index_controller.multiconnectionsAt) 
router.post('/multiconnectionsRange', index_controller.multiconnectionsRange) 
router.post('/dangerousRequest', index_controller.dangerousRequest) 

module.exports = router;
