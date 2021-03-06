const logger = require('link_logger')
const bcrypt = require('bcrypt')
const link_models = require('link_models')
const { authenticationSchema } = link_models.getMongoConnection('jwt')
const {
    StatusError_500
    ,StatusError_401
    ,StatusError_200
} = require('link_http_code')

module.exports = {
    /**
     * Check access_account existence.
     * If exist, send user informations.
     * Else, send a detailed error.
     * 
     * @param login
     * @param password
     * @param callback
     */
    authenticate: async (login, password, callback) => {
        let result = {}
        try {
            await authenticationSchema.findOne({ login: login }, (err, authentication) => {
                if (err) {
                    // Error occured on mongoose => findOne
                    logger.error(`Authentication failed! Mongo error - Could not retrieve data: ${err.message}`)
                    callback(new StatusError_500())
                } else if (authentication) {
                    logger.debug(`found authentication : ${authentication}`)
                    // An authentication was found
                    bcrypt.compare(password, authentication.password, function (err, res) {
                        if (err) {
                            logger.error(`Bad request! Could not get all informations required to execute request! : 
                                    'password'= ${password}, 
                                    'hash'= ${authentication.password}`)
                            logger.error(`Authentication failed! bcrypt error - Could not compare hash: ${err.message}`)
                            callback(new StatusError_500())
                        } else if (!res) {
                            logger.error('Authentication failed! Error 401! Password does not correspond.')
                            callback(new StatusError_401('Authentication failed! Check your login and/or password.'))
                        } else {
                            // Founded authentication password corresponds
                            logger.info('Authentication success!')
                            result = new StatusError_200('Authentication success')
                            result.name = authentication.name
                            result.audience = authentication.audience
                            result.expiresIn = authentication.expiresIn
                            callback(result)
                        }
                    })
                } else {
                    logger.error(`Authentication failed! Error 401! Login does not exist. 'login' : ${login}`)
                    callback(new StatusError_401('Authentication failed! Check your login and/or password.'))
                }
            })
        } catch (err) {
            // Unexpected Error
            logger.error(`Authentication failed! Unexpected error occured: ${err.message}`)
            callback(new StatusError_500())
        }
    }
}