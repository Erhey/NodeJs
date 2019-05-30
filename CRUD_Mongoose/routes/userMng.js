const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")


router.get('/', userController.userMng_get)
router.post('/', userController.userMng_post)
router.get('/create', userController.userMngCreate_get)
router.post('/create', userController.userMngCreate_post)
router.get('/createConfirm', userController.userMngCreateConfirm_get)
router.post('/createConfirm', userController.userMngCreateConfirm_post)
router.post('/createConfirmed', userController.userMngCreateConfirmed)
router.post('/update', userController.userMngUpdate_post)
router.post('/updateVal', userController.userMngUpdateValidation)
router.post('/updateConfirm', userController.userMngUpdateConfirm_post)
router.get('/updateConfirmed', userController.userMngUpdateConfirmed)
router.post('/delete', userController.userMngDelete)
router.post('/deleteConfirmed', userController.userMngDeleteConfirmed)


module.exports = router; 

