


// import UserDao from '../models/userDao';
let UserDao = require("../models/userDao");

let express = require('express');
let router = express.Router();


let userMng_controller = require("../controllers/userMngController")
router.get('/', userMng_controller.index)
router.get('/createUser', userMng_controller.createUser_get)
router.post('/createUser', userMng_controller.createUser_post)
router.get('/createSuccess', userMng_controller.createSuccess)
router.get('/createFail', userMng_controller.createFail)

module.exports = router;
