const mongoose = require("mongoose")
const dao = require("../models/Dao/Dao")
const colors = require("colors")
const User = require("../models/schema/User")
const validator = require("validator")
var moment = require('moment');

exports.userMng_get = (req, res) => { res.render('userMng') }

exports.userMng_post = (req, res) => {
    let postSearchName = req.body.search_name
    let postSearchLogin = req.body.search_login
    let postSearchMail = req.body.search_email
    if(postSearchName === "" && postSearchLogin === "" && postSearchMail === "")  {
        res.locals.noCondErr = "You should at least enter one condition to search for a user"
        res.render('userMng')
    }
    else {
        let conditionSearch = {}
        if(postSearchName !== undefined){
            conditionSearch.name = new RegExp(`.*${postSearchName}.*`)
        }
        if(postSearchLogin !== undefined){
            conditionSearch.login = new RegExp(`.*${postSearchLogin}.*`)
        }
        if(postSearchMail !== undefined){
            conditionSearch.mail = new RegExp(`.*${postSearchMail}.*`)
        }
        
        User.find(conditionSearch, (err, result) => {
            if (err) {
                console.log(err)
                res.render("userMng")
            } else {
                if (result.length === 0) {
                    res.render("userMng", { noUserFoundErr: "No user founded" })
                } else {
                    res.locals.users = result
                    console.log("User Founded !".blue)
                    res.render("userMng")
                }
            }
        })
    }
}
exports.userMngCreate_get = (req, res) => {
    res.render("create")
}
exports.userMngCreate_post = (req, res) => {
    res.locals = checkValidation(req.body)
    if( res.locals.loginErrMes !== undefined ||
                res.locals.passwordErrMes !== undefined ||
                res.locals.nameErrMes !== undefined ||
                res.locals.firstNameErrMes !== undefined ||
                res.locals.telErrMes !== undefined ||
                res.locals.mailErrMes !== undefined ) {

        res.render("create")
    } else {
        res.locals.user = req.body
        res.redirect("/userMng/createConfirm")
    }
}
exports.userMngCreateConfirm_get = (req, res) => {
    res.render("createConfirm")
}
exports.userMngCreateConfirm_post = (req, res) => {
    let user = {}
    user.login = req.body.login
    user.password = req.body.password
    user.name = req.body.name
    user.firstName = req.body.firstName
    user.tel = req.body.tel
    user.mail = req.body.mail

    user.lastConDate = moment().format()
    user.createdDay = moment().format()
    user.isDelete = true

    User.insertOne(user, (err, result) => {
        if(err){
            res.locals.errorMes = "Could not insert user to database."
            res.locals.errordetail = err
        } else {
            res.locals.fullName = user.firstName + " " + user.name
        }
        res.redirect("/userMng/createConfirmed")
    })
}
exports.userMngCreateConfirmed = (req, res) => {
    res.render("createConfirmed")
}

exports.userMngUpdate_post = (req, res) => {
    res.locals.id = req.body.id
    res.locals.login = req.body.login
    res.locals.password = req.body.password
    res.locals.name = req.body.name
    res.locals.firstName = req.body.firstName
    res.locals.tel = req.body.tel
    res.locals.mail = req.body.mail
    res.render("update")
}
exports.userMngUpdateValidation = (req, res) => {
    res.locals = checkValidation(req.body)
    res.locals.id = req.body.id
    res.locals.login = req.body.login
    res.locals.password = req.body.password
    res.locals.name = req.body.name
    res.locals.firstName = req.body.firstName
    res.locals.tel = req.body.tel
    res.locals.mail = req.body.mail
    if( res.locals.loginErrMes !== undefined ||
                res.locals.passwordErrMes !== undefined ||
                res.locals.nameErrMes !== undefined ||
                res.locals.firstNameErrMes !== undefined ||
                res.locals.telErrMes !== undefined ||
                res.locals.mailErrMes !== undefined ) {

        res.render("update")
    } else {
        res.locals.user = req.body
        res.render("updateConfirm")
    }
}
exports.userMngUpdateConfirm_post = (req, res) => {
    let user = {}
    user.login = req.body.login
    user.password = req.body.password
    user.name = req.body.name
    user.firstName = req.body.firstName
    user.tel = req.body.tel
    user.mail = req.body.mail
    console.log(req.body.id)

    User.updateOne({ _id : req.body.id }, user, (err, result) => {
        if(err){
            res.locals.errorMes = "Could not insert user to database."
            console.log(err)

            res.locals.errordetail = err
        } else {
            console.log("EHRHEHREHEHEHREH".red.underline)
            res.locals.fullName = user.firstName + " " + user.name
        }
        console.log(result.rainbow)
        res.redirect("/userMng/updateConfirmed")
    })
}
exports.userMngUpdateConfirmed = (req, res) => {
    res.locals.user = req.body 
    res.render("updateConfirmed")
}
exports.userMngDelete = (req, res) => {
    res.locals.login = req.body.login
    res.locals.password = req.body.password
    res.locals.name = req.body.name
    res.locals.firstName = req.body.firstName
    res.locals.tel = req.body.tel
    res.locals.mail = req.body.mail
    res.render("delete")
}
exports.userMngDeleteConfirmed = (req, res) => {

    User.deleteOne({ _id : req.body.id }, function(err, obj) {
        if(err){
            res.locals.errorMes = "Could not delete user to database."
            res.locals.errordetail = err
        } else {
            // res.locals.fullName = user.firstName + " " + user.name
        }
        res.render("deleteConfirmed")
    });
}

checkValidation = body => {
    let locals = {}
    if(body.login === ""){
        locals.loginErrMes = "login Should not be empty"
    }
    else if (!validator.isLength(body.login, { min: 3, max: 30 })) {
        locals.loginErrMes = "login should be between 3 and 30 characters"
    }
    if(body.password === ""){
        locals.passwordErrMes = "password Should not be empty"
    }
    else if (!validator.isLength(body.password, { min: 3, max: 30 })) {
        locals.passwordErrMes = "password should be between 3 and 30 characters"
    }
    if(body.name === ""){
        locals.nameErrMes = "name Should not be empty"
    } 
    else if (!validator.matches(body.name, /^[\w\s\S]*$/)){
        locals.nameErrMes = "Invalid name (should not content numbers or special characters)"
    }
    if(body.firstName === ""){
        locals.firstNameErrMes = "firstName Should not be empty"
    } 
    else if (!validator.matches(body.firstName, /^[\w\s\S]*$/)){
        locals.firstNameErrMes = "Invalid firstName (should not content numbers or special characters)"
    }
    if(body.tel === ""){
        locals.telErrMes = "tel Should not be empty"
    }
    else if (!validator.matches(body.tel, /^\d{8,13}$/)){
        console.log(" JE PASSE ??? ".rainbow)
        console.log(body.tel.rainbow)
        locals.telErrMes = "Invalid tel number. Should contain 8 to 13 numbers"
    }
    
    if(body.mail === ""){
        locals.mailErrMes = "mail Should not be empty"
    }
    else if (!validator.isEmail(body.mail)){
        locals.mailErrMes = "Invalid mail. Mail example : mail@example.com"
    }
    return locals
}