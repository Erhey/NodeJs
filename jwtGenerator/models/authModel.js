const { jwt: { authentication }, getMongoConnection } = require('link_schema')
const logger = require('link_logger')
const bcrypt = require('bcrypt')

module.exports = {
    authenticate: async (login, password, callback) => {
        let mongoConnection = {}
        try {
            mongoConnection = getMongoConnection('authentication')
            await authentication.authenticationSchema.findOne({ "login": login }, (err, authentication) => {
                if (err) {
                    // Error occured on mongoose => findOne
                    logger.error("Authentication failed! Error occured on fetching authentication data: " + err.message)
                    callback({ "status": 500, "message": "Authentication failed! Call token's provider if the problem persists." })
                } else if (authentication) {
                    // An authentication was found
                    if(bcrypt.compareSync(password, authentication.password)){
                        // Founded authentication password corresponds
                        logger.debug("Authentication success!")
                        callback({ "status": 201, "message": "Authentication success!", "name": authentication.name, "audience": authentication.audience, "expiresIn": authentication.expiresIn })
                    } else {
                        // Password does not correspond to the found login
                        logger.error("Authentication failed!")
                        callback({ "status": 401, "message": "Authentication failed! Check your login and/or password." })
                    }
                } else {
                    // Login does not exist
                    logger.error("Authentication failed!")
                    callback({ "status": 401, "message": "Authentication failed! Check your login and/or password." })
                }
            })
        } catch(err) {
            // Unexpected Error
            logger.error("Authentication failed! Unexpected error occured: " + err.message)
            callback({ "status": 500, "message": "Authentication failed! Unexpected error occured. Call token's provider if the problem persists." })
        } finally {
            mongoConnection.close()
        }
    }
}