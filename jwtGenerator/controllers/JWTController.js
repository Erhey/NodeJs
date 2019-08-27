const authModel = require('../models/authModel')
const { options } = require('../config')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const logger = require('link_logger')

module.exports = {
    /**
     * Generate a specified token linked to the login/password passed parameters
     * 
     * @param login
     * @param password
     * @param callback
     */
    getAccessToken: async (login, password, callback) => {
        // Get access_account information using login/password 
        await authModel.authenticate(login, password, (result) => {
            console.log(result)
            // status 201 => Authentication success!
            if(result.status === 201) {
                // Creating token's informations
                const payload = { name: result.name}
                // Get RSA private key
                const privkey = fs.readFileSync('privkey.pem', 'utf8')
                // Creating a token
                jwt.sign(payload, privkey,  { ...options, audience: result.audience, expiresIn: result.expiresIn }, function(err, token) {

                    if(err) {
                        logger.error(`Error on signing jwt ! Error : ${err.message}`)
                        result.status = 500
                        result.message = 'Could not sign jwt!'
                        callback(result)
                    } else {
                        logger.info(`Token created ! ${token}`)
                        result.token = token
                        callback(result)
                    }
                });
            }else {
                callback(result)
            }
        })
    }
}