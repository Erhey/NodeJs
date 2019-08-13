const mongoose = require('mongoose');
const { options, salt } = require("../config")
const bcrypt = require('bcrypt');
const jwtManager = require('./jwtManager');
const jwtModel = require("../models/jwtModel")
const logger = require('link_logger')(__filename)
const moment = require("moment")
module.exports = {
    createAccount: async (name, login, password, callback) => {
        let result = {}
        result.status = 201
        let account = {}
        let hashed
        try {
            hashed = bcrypt.hashSync(password, salt)
        } catch(err) {
            logger.error("Error occured on hashing password : " + err)
            status = 500;
            result.status = status
            result.error = err
            result.message = "Error occured on hashing password : " + err
            callback(result)
        }
        account.name = name
        account.login = login
        account.password = hashed
        account.createdAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        account.updatedAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        try{
            await jwtModel.insertAccount(account, result => {
                callback(result)
            })
        } catch(err) {
            throw err
        }
    },
    getAccessToken: async (req, res, callback) => {
        const { login, password } = req.body
        let hashed
        let result = {}
        result.status = 201
        try {
            hashed = bcrypt.hashSync(password, salt)
        } catch(err) {
            logger.error("Error occured on hashing password : " + err)
            status = 500;
            result.status = status
            result.error = err
            result.message = "Error occured on hashing password : " + err
            callback(result)
        }
        try{
            await jwtModel.getAccount(login, hashed, result => {
                callback(result)
            })
        } catch(err) {
            throw err
        }
        
    }
}