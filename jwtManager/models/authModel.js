const { jwt: { authentication }, getMongoConnection } = require('link_schema')
const logger = require('link_logger')
module.exports = {
    /**
     * Create a new authentication_account
     * 
     * @param {Object} account authentication_account
     * @param {function} callback
     */
    insert: async (account, callback) => {
        // Initialization
        let result = {}
        let mongoConnection = {}

        try {
            // Create mongo connection
            mongoConnection = await getMongoConnection('authentication')
            // Insert passed account in authentication db
            await authentication.authenticationSchema.insertMany(account, (err, insertedAuthAccount) => {
                if (err) {
                    // Unexpected mongo error
                    logger.error(`Unexpected mongo error occured! ${err.message}`)
                    result.status = 500
                    result.error = err
                    result.message = `Unexpected mongo error occured! ${err.message}`
                } else if (!insertedAuthAccount) {
                    // Insertion Failed
                    logger.error('Error occured on inserting account!')
                    result.status = 404
                    result.error = err
                    result.message = 'Error occured on inserting account!'
                } else {
                    // Insertion success 
                    logger.debug('Insert successful!')
                    result.status = 201
                    result.inserted_auth_account = insertedAuthAccount
                    result.message = 'Insert successful!'
                }
                callback(result)
                // Mongo connection close
                mongoConnection.close()
            })
        } catch (err) {
            // Unexpected error
            logger.error(`Unexpected error occured! ${err.message}`)
            result.status = 500
            result.error = err
            result.message = `Unexpected error occured! ${err.message}`
            callback(result)
        }
    },
    /**
     * Update an existing account
     * 
     * @param {String} _id account id to be updated
     * @param {String} authAccount account informations
     * @param {function} callback
     */
    update: (_id, account, callback) => {
        // Initialization
        let result = {}
        let mongoConnection = {}

        try {
            // Create mongo connection
            mongoConnection = getMongoConnection('authentication')
            // updated passed account in authentication db for id : _id
            authentication.authenticationSchema.updateOne({ "_id": _id }, { $set: account }, (err, updatedAuthAccount) => {
                if (err) {
                    // Unexpected mongo error
                    logger.error(`Unexpected mongo error occured! ${err.message}`)
                    result.status = 500
                    result.error = err
                    result.message = `Unexpected mongo error occured! ${err.message}`
                } else if (!updatedAuthAccount) {
                    // Update Failed
                    logger.error('Error occured on updating authentication account!')
                    result.status = 404
                    result.error = err
                    result.message = 'Error occured on updating authentication account!'
                } else {
                    // Update success 
                    logger.debug('Authentication account was successfully updated!')
                    result.status = 201
                    result.updated_auth_account = updatedAuthAccount
                    result.message = 'Authentication account was successfully updated!'
                }
                callback(result)
                // Mongo connection close
                mongoConnection.close()
            })
        } catch (err) {
            // Unexpected error
            logger.error(`Unexpected error occured! ${err.message}`)
            result.status = 500
            result.error = err
            result.message = `Unexpected error occured! ${err.message}`
            callback(result)
        }
    },
    /**
     * Delete an existing account
     * 
     * @param {String} _id account id to be deleted
     * @param {function} callback
     */
    delete: (_id, callback) => {
        // Initialization
        let result = {}
        let mongoConnection = {}

        try {
            // Create mongo connection
            mongoConnection = getMongoConnection('authentication')
            // Delete account in authentication db for id : _id
            authentication.authenticationSchema.deleteOne({ "_id": _id }, (err, deletedAuthAccount) => {
                if (err) {
                    // Unexpected mongo error
                    logger.error(`Unexpected mongo error occured! ${err.message}`)
                    result.status = 500
                    result.error = err
                    result.message = `Unexpected mongo error occured! ${err.message}`
                } else if (!deletedAuthAccount) {
                    // Update Failed
                    logger.error(`Error occured on deleting authentication account!`)
                    result.status = 404
                    result.error = err
                    result.message = `Error occured on deleting authentication account!`
                } else {
                    // Delete success 
                    logger.debug('Authentication account was successfully deleted!')
                    result.status = 201
                    result.deleted_auth_account = deletedAuthAccount
                    result.message = 'Authentication account was successfully deleted!'
                }
                callback(result)
                // Mongo connection close
                mongoConnection.close()
            })
        } catch (err) {
            // Unexpected error
            logger.error(`Unexpected error occured! ${err.message}`)
            result.status = 500
            result.error = err
            result.message = `Unexpected error occured! ${err.message}`
            callback(result)
        }
    },
    /**
     * Get authentication_account _id from it's login
     * 
     * @param {String} login
     * @param {function} callback
     */
    getIdFromLogin: (login, callback) => {
        let mongoConnection = {}
        try {
            // Create mongo connection
            mongoConnection = getMongoConnection('authentication')
            // Look in authentication database if any authentication_account exist for login = passed_login
            authentication.authenticationSchema.findOne({ login: login }, (err, authAccount) => {
                if (err || !authAccount) {
                    logger.debug('authentication_account not found')
                    callback(false)
                } else {
                    callback(authAccount._id)
                }
                // Mongo connection close
                mongoConnection.close()
            })
        } catch (err) {
            // Unexpected error
            logger.error(`Unexpected error occured! ${err.message}`)
            result.status = 500
            result.error = err
            result.message = `Unexpected error occured! ${err.message}`
            callback(result)
        }
    }
}