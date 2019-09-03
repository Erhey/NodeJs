const { options } = require('./config')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const logger = require('link_logger')
const moment = require('moment')

/**
 * Function to be exported. Create a Tracker with parameters.
 * 
 * @param {String} audience 
 */
validateTokenGenerator = (...audiences) => {
    return async (req, res, next) => {
        let authorization = req.headers.authorization
        if (!authorization) {
            logger.error('No credential sent!')
            res.status(402).send({
                status: 402
                ,error: 'No credential sent!' 
            })
        } else {
            let token = authorization.split(' ')[1]
            const pubkey = fs.readFileSync(__dirname + '/pubkey.pem', 'utf8')
            await audiences.forEach(audience => {
                logger.debug('Checking options')
                jwt.verify(token, pubkey, { ...options, audience: audience }, (err, decoded) => {
                    if (err) {
                        if(err.name === 'JsonWebTokenError') {
                            logger.error('No right to access current server !')
                            logger.error(jwt.decode(token))
                            res.status(405).send({
                                status : 405
                                ,error: 'Current user don\'t have the right to access to this server.'
                                ,detail : err.message
                            })
                        } else if (err.name === 'TokenExpiredError'){
                            logger.error('JWT expired!')
                            res.status(406).send( {
                                status : 406
                                ,error: err.message
                                ,expiredAt : moment(err.expiredAt).format('YYYY-MM-DD HH:mm:ss.SSS')
                            })
                        } else {
                            logger.error(`Unexpected Error! ${err}`)
                            res.status(500).send({
                                status : 500
                                ,error: 'Server internal issue occured. Contact manager if error persists!'
                            }) 
                        }
                    } else {
                        if (decoded) {
                            logger.info('Token got validated! Accessing to the ressource!')
                            return next()
                        } else {
                            logger.error('Unexpected Error! JWT could not be decoded!')
                            res.status(500).send({
                                status : 500
                                ,error: 'Server internal issue occured. JWT could not be decoded!'
                            }) 
                        }
                    }
                })
            })
        }
    }
}
module.exports = validateTokenGenerator
