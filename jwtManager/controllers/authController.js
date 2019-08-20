const bcrypt = require('bcrypt')
const authModel = require('../models/authModel')
const logger = require('link_logger')
const moment = require('moment')

module.exports = {
    /**
     * Create a new authentication_account
     * 
     * @param {String} name
     * @param {String} login
     * @param {String} password
     * @param {String} audience
     * @param {String} expiresIn '1d', '3m'
     * @param {function} callback
     */
    insertAuthAccount: async (name, login, password, audience, expiresIn, callback) => {
        let authAccount = {}
        let hashed = ''
        try {
            // Get a hashed password from password parameter
            hashed = bcrypt.hashSync(password, 10)
        } catch (err) {
            let result = {}
            logger.error(`Error occured on hashing password : ${err.message}`)
            result.status = 500
            result.error = err
            result.message = `Error occured on hashing password : ${err.message}`
            callback(result)
        }
        if (hashed !== '') {

            // Create authentication_account object
            authAccount.name = name
            authAccount.login = login
            authAccount.password = hashed
            authAccount.audience = audience
            authAccount.expiresIn = expiresIn
            authAccount.createdAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
            authAccount.updatedAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
            try {
                // Insert account in Mongodb Database
                await authModel.insert(authAccount, result => {
                    callback(result)
                })
            } catch (err) {
                let result = {}
                logger.error(`Error occured on hashing password : ${err.message}`)
                result.status = 500
                result.error = err
                result.message = `Error occured on hashing password : ${err.message}`
                callback(result)
            }
        }
    },
    /**
     * Update an existing account
     * 
     * @param {String} _id account id to be updated
     * @param {String} authAccount account informations
     * @param {function} callback
     */
    updateAuthAccount: async (_id, authAccount, callback) => {
        try {
            if (_id) {
                try {
                    // Get a hashed password from authAccount password
                    if (authAccount.password) {
                        authAccount.password = bcrypt.hashSync(authAccount.password, 10)
                    }
                } catch (err) {
                    logger.error(`Error occured on hashing password : ${err.message}`)
                    status = 500
                    result.status = status
                    result.error = err
                    result.message = `Error occured on hashing password : ${err.message}`
                    callback(result)
                }
                authAccount.updatedAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                // update prepared authentication_account
                await authModel.update(_id, authAccount, result => {
                    callback(result)
                })
            } else {
                let result = {}
                logger.error('Login does not exist')
                result.status = 404
                result.error = err
                result.message = 'Login does not exist'
                callback(result)
            }
        } catch (err) {
            let result = {}
            logger.error('Unexpected error occured!')
            result.status = 404
            result.error = err
            result.message = `Unexpected error occured! ${err.message}`
            callback(result)
        }
    },

    /**
     * Delete an existing account
     * 
     * @param {String} _id account id to be updated
     * @param {function} callback
     */
    deleteAuthAccount: async (_id, callback) => {
        try {
            await authModel.delete(_id, result => {
                callback(result)
            })
        } catch (err) {
            let result = {}
            logger.error('Unexpected error occured!')
            result.status = 404
            result.error = err
            result.message = `Unexpected error occured! ${err.message}`
            callback(result)
        }
    }
}