const { jwt: { authenticationSchema }, getMongoConnection } = require('link_schema')
const logger = require('link_logger')
const bcrypt = require('bcrypt')

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
        let mongoConnection = {}
        let result = {}
        try {
            mongoConnection = getMongoConnection('authentication')
            await authenticationSchema.findOne({ "login": login }, (err, authentication) => {
                if (err) {
                    // Error occured on mongoose => findOne
                    logger.error(`Authentication failed! Mongo error - Could not retrieve data: ${err.message}`)
                    result.status = 500
                    result.message = 'Unexpected Error occured! Authentication fail!'
                    callback(result)
                } else if (authentication) {
                    // An authentication was found
                    bcrypt.compare(password, authentication.hash, function(err, res) {
                        if(err){
                            logger.error(`Authentication failed! bcrypt error - Could not compare hash: ${err.message}`)
                            result.status = 500
                            result.message = 'Unexpected Error occured! Authentication fail!'
                        } else if (!res) {
                            logger.error('Authentication failed! Error 401! Password does not correspond.')
                            result.status = 401
                            result.message = 'Authentication failed! Check your login and/or password.'
                        } else {
                            // Founded authentication password corresponds
                            logger.info('Authentication success!')
                            result.status = 401
                            result.message = 'Authentication failed! Check your login and/or password.'
                            result.name = authentication.name
                            result.audience = authentication.audience
                            result.expiresIn = authentication.expiresIn 
                        }
                        callback(result)
                    });
                } else {
                    logger.error('Authentication failed! Error 401! Login does not exist')
                    result.status = 401
                    result.message = 'Authentication failed! Check your login and/or password.'
                    callback(result)
                }
                mongoConnection.close()
            })
        } catch (err) {
            // Unexpected Error
            logger.error(`Authentication failed! Unexpected error occured: ${err.message}`)
            result.status = 500
            result.message = 'Unexpected Error occured! Authentication fail!'
            callback(result)
            mongoConnection.close()
        }
    }
}