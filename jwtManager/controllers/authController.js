const bcrypt = require('bcrypt');
const authModel = require("../models/authModel")
const logger = require('link_logger')(__filename)
const moment = require("moment")

module.exports = {
    insertAuthAccount: async (name, login, password, callback) => {
        let authAccount = {}
        let hashed = ""
        try {
            hashed = bcrypt.hashSync(password, 10)
        } catch(err) {
            let result = {}
            logger.error("Error occured on hashing password : " + err.message)
            result.status = 500
            result.error = err
            result.message = "Error occured on hashing password : " + err.message
            callback(result)
        }
        authAccount.name = name
        authAccount.login = login
        authAccount.password = hashed
        authAccount.createdAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        authAccount.updatedAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        try{
            await authModel.insert(authAccount, result => {
                callback(result)
            })
        } catch(err) {
            throw err
        }
    },
    updateAuthAccount: async (_id, authAccount, callback) => {
        try {
            if(_id) {
                try {
                    authAccount.password = bcrypt.hashSync(authAccount.password, 10)
                } catch(err) {
                    logger.error("Error occured on hashing password : " + err)
                    status = 500;
                    result.status = status
                    result.error = err
                    result.message = "Error occured on hashing password : " + err
                    callback(result)
                }
                authAccount.updatedAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                await authModel.update(_id, authAccount, result => {
                    callback(result)
                })
            } else {
            let result = {}
            logger.error("Login does not exist")
                result.status = 404
                result.error = err
                result.message = "Login does not exist"
                callback(result)
            }
        } catch(err) {
            let result = {}
            logger.error("Unexpected error occured!")
            result.status = 404
            result.error = err
            result.message = "Unexpected error occured!" + err.message
            callback(result)
        }
    },
    deleteAuthAccount: async (_id, callback) => {
        try {
            await authModel.delete(_id, result => {
                callback(result)
            })
        } catch(err) {
            let result = {}
            logger.error("Unexpected error occured!")
            result.status = 404
            result.error = err
            result.message = "Unexpected error occured!" + err.message
            callback(result)
        }
    }
}