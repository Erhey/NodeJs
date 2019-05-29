
const mongoose = require("mongoose")
const dao = require("../models/Dao/Dao")
const colors = require("colors")
const Connection = require("../models/schema/Connection")
const validator = require("validator")
exports.index = (req, res) => {
    console.log("test".rainbow)
    res.render('index')
}
exports.login_get = (req, res) => { res.render("login") }
exports.login_post = (req, res) => {
    let postLogin = req.body.login
    let postPassword = req.body.password
    if (postLogin === undefined) {
        res.locals.loginErr = "Login is required !"
    }
    else if (!validator.isLength(postLogin, { min: 8, max: 30 })) {
        res.locals.loginErr = "Login should be between 8 and 30 characters"
    }

    if (postPassword === undefined) {
        res.locals.passwordErr = "Password is required !"
    }
    else if (!validator.isLength(postPassword, { min: 8, max: 30 })) {
        res.locals.passwordErr = "Password should be between 8 and 30 characters"
    }
    if (res.locals.loginErr !== undefined || res.locals.passwordErr !== undefined) {
        res.render("login")
    } else {
        Connection.find({ login: postLogin, password: postPassword }, (err, result) => {
            if (err) {
                console.log(err)
                res.render("login")
            } else {
                if (result.length === 0) {
                    res.render("login", { authenticationErr: "Login or password incorrect !" })
                } else {
                    console.log("Connection Success".green)
                    res.render("userMng")
                }
            }
        })
    }
}