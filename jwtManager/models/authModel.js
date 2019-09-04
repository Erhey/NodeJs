const link_models = require('link_models')
const { authenticationSchema } = link_models.getMongoConnection('jwt')
const logger = require('link_logger')

const {
    StatusError_201
    ,StatusError_500
} = require('link_http_code')


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
        try {
            // Create mongo connection
            // Insert passed account in authentication db
            await authenticationSchema.insertMany(account, (err, insertedAuthAccount) => {
                if (err) {
                    // Unexpected mongo error
                    logger.error(`Unexpected mongo error occured! ${err.message}`)
                    result = new StatusError_500(`Unexpected mongo error occured! ${err.message}`)
                } else if (!insertedAuthAccount) {
                    // Insertion Failed
                    logger.error('Error occured on inserting account!')
                    result = new StatusError_500('Error occured on inserting account!')
                } else {
                    // Insertion success 
                    logger.debug('Authentication account was successfully inserted!')
                    result = new StatusError_201('Authentication account was successfully inserted!')
                    result.inserted_auth_account = insertedAuthAccount
                }
                callback(result)
                // Mongo connection close
            })
        } catch (err) {
            // Unexpected error
            logger.error(`Unexpected error occured! ${err.message}`)
            callback(new StatusError_500())
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
        try {
            // updated passed account in authentication db for id : _id
            authenticationSchema.updateOne({ _id: _id }, { $set: account }, (err, updatedAuthAccount) => {
                if (err) {
                    // Unexpected mongo error
                    logger.error(`Unexpected mongo error occured! ${err.message}`)
                    result = new StatusError_500(`Unexpected mongo error occured! ${err.message}`)
                } else if (!updatedAuthAccount) {
                    // Update Failed
                    logger.error('Error occured on updating authentication account!')
                    result = new StatusError_500('Error occured on update account!')
                } else {
                    // Update success 
                    logger.debug('Authentication account was successfully updated!')
                    result = new StatusError_201('Authentication account was successfully updated!')
                    result.updated_auth_account = updatedAuthAccount
                }
                callback(result)
                // Mongo connection close
            })
        } catch (err) {
            // Unexpected error
            logger.error(`Unexpected error occured! ${err.message}`)
            callback(new StatusError_500())
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
        try {
            // Delete account in authentication db for id : _id
            authenticationSchema.deleteOne({ _id: _id }, (err, deletedAuthAccount) => {
                if (err) {
                    // Unexpected mongo error
                    logger.error(`Unexpected mongo error occured! ${err.message}`)
                    result = new StatusError_500(`Unexpected mongo error occured! ${err.message}`)
                } else if (!deletedAuthAccount) {
                    // Update Failed
                    logger.error(`Error occured on deleting authentication account!`)
                    result = new StatusError_500('Error occured on delete account!')
                } else {
                    // Delete success 
                    logger.debug('Authentication account was successfully deleted!')
                    result = new StatusError_201('Authentication account was successfully deleted!')
                    result.deleted_auth_account = deletedAuthAccount
                }
                callback(result)
                // Mongo connection close
            })
        } catch (err) {
            // Unexpected error
            logger.error(`Unexpected error occured! ${err.message}`)
            callback(new StatusError_500())
        }
    },
    /**
     * Get authentication_account _id from it's login
     * 
     * @param {String} login
     * @param {function} callback
     */
    getIdFromLogin: (login, callback) => {
        try {
            // Look in authentication database if any authentication_account exist for login = passed_login
            authenticationSchema.findOne({ login: login }, (err, authAccount) => {
                if (err || !authAccount) {
                    logger.debug('authentication_account not found')
                    callback(false)
                } else {
                    callback(authAccount._id)
                }
                // Mongo connection close
            })
        } catch (err) {
            // Unexpected error
            logger.error(`Unexpected error occured! ${err.message}`)
            callback(new StatusError_500())
        }
    }
}