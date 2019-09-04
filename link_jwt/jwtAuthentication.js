const { options } = require('./config')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const logger = require('link_logger')
const moment = require('moment')
const {
    StatusError_401
    ,StatusError_403
    ,StatusError_500
} = require('link_http_code')


/**
 * Function to be exported. Create a Tracker with parameters.
 * 
 * @param {String} audience 
 */
validateTokenGenerator = (...audiences) => {
    return async (req, res, next) => {
        // Check if in headers authorization has been setted
        let authorization = req.headers.authorization
        if (!authorization) {
            // unauthorized : No credential sent <=> no authorization in headers request
            logger.error('No credential sent!')
            res.status(401).send(new StatusError_401('No credential sent!'))
        } else {
            // headers has an authorization
            let token = authorization.split(' ')[1]
            // decrypts it with public key
            const pubkey = fs.readFileSync(__dirname + '/pubkey.pem', 'utf8')
            // check for each audience if the passed jwt has all rights
            await audiences.forEach(audience => {
                logger.debug('Checking options')
                jwt.verify(token, pubkey, { ...options, audience: audience }, (err, decoded) => {
                    if (err) {
                        // JsonWebTokenError
                        if(err.name === 'JsonWebTokenError') {
                            logger.error('No right to access current server !')
                            logger.error(jwt.decode(token))
                            res.status(403).send(new StatusError_403(`Current user don't have the right to access to this server. JsonWebTokenError: ${err.message}`))
                        }
                        // Token expired error
                        else if (err.name === 'TokenExpiredError'){
                            logger.error('JWT expired!')
                            res.status(403).send(new StatusError_403(`Current user don't have the right to access to this server. TokenExpiredError: ${moment(err.expiredAt).format('YYYY-MM-DD HH:mm:ss.SSS')}`))
                        }
                        // Unexpected error
                        else {
                            logger.error(`Unexpected Error! ${err}`)
                            res.status(500).send(new StatusError_500('Server internal issue occured. Contact manager if error persists!')) 
                        }
                    } else {
                        if (decoded) {
                            // Token well formed there are no problems for this audience
                            // If one got validated got to next!
                            logger.info('Token got validated! Accessing to the ressource!')
                            return next()
                        } else {
                            // Unexpected error
                            logger.error('Unexpected Error! JWT could not be decoded!')
                            res.status(500).send(new StatusError_500('Unexpected Error! JWT could not be decoded!')) 
                        }
                    }
                })
            })
        }
    }
}
module.exports = validateTokenGenerator
