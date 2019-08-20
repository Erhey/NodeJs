var express = require('express')
var router = express.Router()
const authController = require('../controllers/authController')
const authModel = require('../models/authModel')
const utils = require('../utils')

// Protect access using JWT
const validateToken = require('link_jwt')
router.use(validateToken('jwt_mng'))

// Insert handler
router.post('/insertAuthAccount', function (req, res, next) {
    authController.insertAuthAccount(req.body.name, req.body.login, req.body.password, req.body.audience, req.body.expiresIn, result => {
        res.send(result)
    })
})
// Update handler
router.post('/updateAuthAccount', function (req, res, next) {
    if (req.body._id) {
        let authAccount = utils.createAuthAccountObj(req.body)
        authController.updateAuthAccount(req.body._id, authAccount, result => {
            res.send(result)
        })
    } else {
        res.send({ "status": 403, "message": 'Please post an id to update an account.' })
    }
})
// Delete handler
router.post('/deleteAuthAccount', function (req, res, next) {
    if (req.body.login) {
        authModel.getIdFromLogin(req.body.login, _id => {
            if (_id) {
                authController.deleteAuthAccount(_id, result => {
                    res.send(result)
                })
            } else {
                res.send({ "status": 403, "message": `User not found for login : ${req.body.login}` })
            }
        })
    } else if(req.body._id) {
        authController.deleteAuthAccount(req.body._id, result => {
            res.send(result)
        })
    } else {
        res.send({ "status": 403, "message": 'Please post a login or an id to delete.' })
    }
})

module.exports = router
