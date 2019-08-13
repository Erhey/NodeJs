const mongoose = require('mongoose');
const { authentication } = require('link_schema');
const logger = require("link_logger")(__filename)
module.exports = {
    insertAccount: (account, callback) => {
        let result = {}
        result.status = 201
        try {
            authentication.authenticationSchema.insertMany(account, (err, accountSaved) => {
                if (err) {
                    logger.error("Error occured on inserting account : " + err)
                    status = 500;
                    result.status = status
                    result.error = err
                    result.message = "Error occured on inserting account : " + err
                } else {
                    result.accountCreated = accountSaved
                }
                callback(result)
            })
        } catch (e) {
            throw e
        }
    },
    getAccount: (login, hashed, callback) => {
        let result = {}
        result.status = 201
        console.log(login)
        console.log(hashed)
        console.log("$2b$10$wUf8xwHmGAWxNkjqnnxVCeHWGMvvZdTdKAb1Habh7WaAhlnurp7BW")
        authentication.authenticationSchema.findOne({ "login" : login, "password" : hashed  }, (err, account) => {
            if (err) {
                logger.error("Error occured while fetch account datas : " + err)
                status = 500
                result.status = status
                result.error = err
                result.message = "Error occured on hashing password : " + err
                callback(result)
            } else if (account) {
                    if (match) {
                        status = 200;
                        // Create a token
                        const payload = { account: account.name }
                        const jwtOptions = options
                        const token = jwtManager.sign(payload, jwtOptions)
                        result.token = token
                        result.status = status
                        result.result = user
                    } else {
                        status = 401
                        result.status = status
                        result.error = `Authentication error`
                    }
                    callback(result)
            } else {
                status = 401;
                result.status = status
                result.error = err
                logger.error("User not found : " + err)
                callback(result)
            }
        })
    }
}