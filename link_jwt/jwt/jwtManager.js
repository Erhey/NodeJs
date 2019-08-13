const fs = require('fs')
const jwt = require('jsonwebtoken')

// use 'utf8' to get string instead of byte array  (512 bit key)
var privateKEY = fs.readFileSync('./privkey.pem', 'utf8')
var publicKEY = fs.readFileSync('./pubkey.pem', 'utf8')
module.exports = {
    sign: (payload, options) => {
        /*
        sOptions = {
            issuer: "Authorization/Resource/mysqldb",
            subject: "kevin.martin.eng@outlook.com"
        }
        */
        // Token signing options
        var signOptions = {
            issuer: options.issuer,
            subject: options.subject,
            expiresIn: "1d",
            algorithm: "RS256"
        }
        return jwt.sign(payload, privateKEY, signOptions)
    },
    verify: (token, options) => {
        /*
        vOption = {
            issuer: "Authorization/Resource/mysqldb",
            subject: "kevin.martin.eng@outlook.com"
        }  
        */
        var verifyOptions = {
            issuer: options.issuer,
            subject: options.subject,
            algorithm: ["RS256"]
        }
        try {
            return jwt.verify(token, publicKEY, verifyOptions)
        } catch (err) {
            return false
        }
    },
    decode: (token) => {
        return jwt.decode(token, { complete: true })
        //returns null if token is invalid
    }
}