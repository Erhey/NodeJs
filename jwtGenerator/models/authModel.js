const { authentication } = require('link_schema');
const logger = require("link_logger")(__filename)
const bcrypt = require("bcrypt")
module.exports = {
    authenticate: (login, password, callback) => {
        try {
            authentication.authenticationSchema.findOne({ "login" : login }, (err, authentication) => {
                if (err) {
                    // Error occured on mongoose => findOne
                    logger.error("Authentication failed! Error occured on fetching authentication data : " + err.message)
                    callback({ "status" : 500, "message" : "Authentication failed! Call token's provider if the problem persists." })
                } else if (authentication) {
                    // An authentication was found
                    if(bcrypt.compareSync(password, authentication.password)){
                        // Founded authentication password corresponds
                        logger.debug("Authentication success!")
                        callback({ "status" : 201, "message" : "Authentication success!", "auth_name" : authentication.name })
                    } else {
                        // Password does not correspond to the found login
                        logger.error("Authentication failed!")
                        callback({ "status" : 401, "message" : "Authentication failed! Check your login and/or password." })
                    }
                } else {
                    // Login does not exist
                    logger.error("Authentication failed!")
                    callback({ "status" : 401, "message" : "Authentication failed! Check your login and/or password." })
                }
            })
        } catch(err) {
            // Unexpected Error
            logger.error("Authentication failed! Unexpected error occured : " + err.message)
            callback({ "status" : 500, "message" : "Authentication failed! Unexpected error occured. Call token's provider if the problem persists." })
        }
    }
}