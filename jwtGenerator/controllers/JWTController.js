const authModel = require("../models/authModel")
const { options } = require("../config")
const fs = require('fs')
const jwt = require('jsonwebtoken')
module.exports = {
    getAccessToken: async (login, password, callback) => {
        try{
            await authModel.authenticate(login, password, (result) => {
                if(result.status === 201) {
                    // Authentication success! Creating a token
                    const payload = { name: result.auth_name }
                    const privkey = fs.readFileSync('privkey.pem', 'utf8')
                    result.token = jwt.sign(payload, privkey, options)
                }
                callback(result)
            })
        } catch(err) {
            throw err
        }
    }
}