const { options } = require("./config")
const fs = require('fs')
const jwt = require('jsonwebtoken')
const logger = require('link_logger')

/**
 * Function to be exported. Create a Tracker with parameters.
 * 
 * @param {String} audience 
 */
validateTokenGenerator = (...audiences) => {
    return async (req, res, next) => {
        let verified = false
        let authorization = req.headers.authorization
        if (!authorization) {
            res.send({ "status": 403, "error": 'No credential sent!' })
        } else {
            let token = authorization.split(' ')[1]
            const pubkey = fs.readFileSync(__dirname + '/pubkey.pem', 'utf8')
            await audiences.forEach(audience => {
                logger.debug(`checking ${audience}`)
                jwt.verify(token, pubkey, { ...options, audience: audience }, (err, decoded) => {
                    if (decoded) {
                        verified = true
                        return next()
                    }
                })
            })
            if (!verified) {
                res.send({ "status": 401, "error": 'Authentication fail!' })
            }
        }
    }
}
module.exports = validateTokenGenerator
