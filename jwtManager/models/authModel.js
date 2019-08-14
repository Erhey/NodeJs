const { authentication } = require('link_schema');
const logger = require("link_logger")(__filename)
module.exports = {
    insert: (account, callback) => {
        let result = {}
        try {
            authentication.authenticationSchema.insertMany(account, (err, insertedAuthAccount) => {
                if (err || !insertedAuthAccount) {
                    logger.error("Error occured on inserting account : " + err.message)
                    result.status = 500
                    result.error = err
                    result.message = "Error occured on inserting account : " + err.message
                } else {
                    logger.debug("Insert successful!")
                    result.status = 201
                    result.inserted_auth_account = insertedAuthAccount
                    result.message = "Insert successful!"
                }
                callback(result)
            })
        } catch (e) {
            throw e
        }
    },
    update: (_id, account, callback) => {
        let result = {}
        try {
            authentication.authenticationSchema.updateOne({ "_id": _id }, { $set: account }, (err, updatedAuthAccount) => {
                if (err || !updatedAuthAccount) {
                    logger.error("Error occured on updating authentication account : " + err.message)
                    result.status = 500
                    result.error = err
                    result.message = "Error occured on updating authentication account : " + err.message
                } else {
                    logger.debug("Authentication account was successfully updated!")
                    result.status = 201
                    result.updated_auth_account = updatedAuthAccount
                    result.message = "Authentication account was successfully updated!"
                }
                callback(result)
            })
        } catch (e) {
            throw e
        }
    },
    delete: (_id, callback) => {
        let result = {}
        result.status = 201
        try {
            authentication.authenticationSchema.deleteOne({ "_id": _id }, (err, deletedAuthAccount) => {
                if (err || !deletedAuthAccount) {
                    logger.error("Error occured on deleting authentication account : " + err.message)
                    result.status = 500
                    result.error = err
                    result.message = "Error occured on deleting authentication account : " + err.message
                } else {
                    logger.debug("Authentication account was successfully deleted!")
                    result.status = 201
                    result.deleted_auth_account = deletedAuthAccount
                    result.message = "Authentication account was successfully deleted!"
                }
                callback(result)
            })
        } catch (e) {
            throw e
        }
    },
    find: (login, callback) => {
        authentication.authenticationSchema.findOne({ login : login }, (err, authAccount) => {
            if(err || !authAccount) {
                callback(false)
            } else {
                callback(authAccount._id)
            }
        })
    }
}