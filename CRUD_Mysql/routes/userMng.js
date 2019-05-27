


// import UserDao from '../models/userDao';
let UserDao = require("../models/userDao");

let express = require('express');
let router = express.Router();


let userMng_controller = require("../controllers/userMngController")
router.get('/', userMng_controller.index)
router.get('/createUser', userMng_controller.createUser_get)
router.post('/createUser', userMng_controller.createUser_post)
router.get('/searchUser', userMng_controller.searchUser_get)
router.post('/searchUser', userMng_controller.searchUser_post)
router.post('/deleteUser', userMng_controller.deleteUser_post)
router.post('/deleteConfirmUser', userMng_controller.deleteConfirmUser_post)
router.post('/updateUser', userMng_controller.updateUser_post)
router.post('/updateConfirmUser', userMng_controller.updateConfirmUser_post)
router.get('/createSuccess', userMng_controller.createSuccess)
router.get('/createFail', userMng_controller.createFail)

module.exports = router;
