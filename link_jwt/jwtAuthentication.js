const { options } = require("./config")
const fs = require('fs')
const jwt = require('jsonwebtoken')

/**
 * Function to be exported. Create a Tracker with parameters.
 * 
 * @param {String} audience 
 */
validateTokenGenerator = (audience) => {
    return (req, res, next) => {
        let authorization = req.headers.authorization
        if (!authorization) {
            res.send({ "status": 403, "error": 'No credential sent!' })
        } else {
            let token = authorization.split(' ')[1]
            const pubkey = fs.readFileSync(__dirname + '/pubkey.pem', 'utf8')
            if (jwt.verify(token, pubkey, { ...options, audience: audience })) {
                jwt.decode(token)
                next()
            } else {
                res.send({ "status": 401, "error": 'Authentication fail!' })
            }
        }
    }
} 
module.exports = validateTokenGenerator

