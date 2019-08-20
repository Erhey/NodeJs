const authModel = require('../models/authModel')
const { options } = require('../config')
const fs = require('fs')
const jwt = require('jsonwebtoken')

module.exports = {
    /**
     * Generate a specified token linked to the login/password passed parameters
     * 
     * @param login
     * @param password
     * @param callback
     */
    getAccessToken: async (login, password, callback) => {
        try{
            // Get access_account information using login/password 
            await authModel.authenticate(login, password, (result) => {
                // status 201 => Authentication success!
                if(result.status === 201) {
                    // Creating token's informations
                    const payload = { name: result.name}
                    // Get RSA private key
                    const privkey = fs.readFileSync('privkey.pem', 'utf8')
                    // Creating a token
                    result.token = jwt.sign(payload, privkey, { ...options, audience: result.audience, expiresIn: result.expiresIn })
                }
                callback(result)
            })
        } catch(err) {
            logger.error(err)
            callback({ "status": 500, "message": "Authentication failed! Unexpected error occured. Call token's provider if the problem persists." })
        }
    }
}