const logger = require('link_logger')
const {
    StatusError_200
    , StatusError_204
    , StatusError_201
    , StatusError_400
    , StatusError_500
    , StatusError_502
} = require('link_http_code')

const link_models = require('link_models')
module.exports = {

    /**
     * Main function
     * Execute Mongo request
     */
    exec: async ({ configName, queryType, collection, queryContent, uuidKey }, callback) => {
        try {
            // Dispatch query by queryType : 
            // find / findOne / insertMany / replaceOne / UpdateMany...
            switch (queryType) {
                case 'find':
                    await find(configName, collection, queryContent, uuidKey, result => {
                        callback(result)
                    })
                    break
                case 'findOne':
                    await findOne(configName, collection, queryContent, uuidKey, result => {
                        callback(result)
                    })
                    break
                case 'insertOne':
                    await insertMany(configName, collection, queryContent, uuidKey, result => {
                        callback(result)
                    })
                    break
                case 'insertMany':
                    await insertMany(configName, collection, queryContent, uuidKey, result => {
                        callback(result)
                    })
                    break
                case 'replaceOne':
                    await replaceOne(configName, collection, queryContent, uuidKey, result => {
                        callback(result)
                    })
                    break
                case 'updateMany':
                    await updateMany(configName, collection, queryContent, uuidKey, result => {
                        callback(result)
                    })
                    break
                default:
                    // queryType is not valuable! Bad request!
                    logger.info(`Please define a valuable queryType! queryType : ${queryType}`)
                    callback(new StatusError_400('Please define a valuable queryType!'))
                    break
            }
        } catch (err) {
            // Internal Unexpected Server error
            logger.error(`Unexpected error occured ! + ${err}`)
            callback(new StatusError_500())
            throw err
        }
    }
}

/**
 * Find
 */
find = async (configName, collection, queryContent, uuidKey, callback) => {
    try {
        // Get mongoConnection with all configuration presetted
        let mongoConnection = link_models.getMongoConnection(configName)
        // Use dynamic name for collection
        let result = {}
        let documents = await mongoConnection[`${collection}Schema`].find(queryContent)//.cache(uuidKey)
        if (!documents) {
            logger.warn(`No document found! : ${documents}`)
            callback(new StatusError_204())
        } else {
            logger.debug(`documents found! : ${documents}`)
            result = new StatusError_200()
            result.documents = documents
            callback(result)
        }
    } catch (err) {
        // Unexpected error occured on MongoDb request
        logger.error(`MongoDb error occured! Parameters : 
                            'collection' : ${collection} 
                            'configName' : ${configName} 
                            'queryContent' : ${queryContent} 
                            'Error' : ${err}`)
        callback(new StatusError_502('MongoDb error occured!'))
    }
}
/**
 * findOne
 */
findOne = async (configName, collection, queryContent, uuidKey, callback) => {
    
    try {
        // Get mongoConnection with all configuration presetted
        let mongoConnection = link_models.getMongoConnection(configName)
        // Use dynamic name for collection
        let result = {}
        let document = await mongoConnection[`${collection}Schema`].findOne(queryContent)//.cache(uuidKey)
        if (!document) {
            // No error but no document for the current setup
            logger.warn(`No document found! : ${document}`)
            callback(new StatusError_204())
        } else {
            // Document found!
            logger.debug(`document found! : ${document}`)
            result = new StatusError_200()
            result.document = document
            callback(result)
        }
    } catch (err) {
        // Unexpected error occured on MongoDb request
        logger.error(`MongoDb error occured! Parameters : 
                        'collection' : ${collection} 
                        'configName' : ${configName} 
                        'queryContent' : ${queryContent} 
                        'Error' : ${err}`)
        callback(new StatusError_502('MongoDb error occured!'))
    }
}


/**
 * replaceOne 
 * Replace entirely the document passed.
 * Care ! Does not count any validation from schema.
 * Furthermore, all concerned document data will be erased!
 * If does not exist => create a new one 
 */
replaceOne = async (configName, collection, queryContent, uuidKey, callback) => {
    // Update needs filter and record parameters to be executed
    if (queryContent.filter !== undefined && queryContent.record !== undefined) {
        try {
            // Get mongoConnection with all configuration presetted
            let mongoConnection = link_models.getMongoConnection(configName)
            // Use dynamic name for collection
            let result = await mongoConnection[`${collection}Schema`].replaceOne(queryContent.filter, queryContent.record, { upsert: true })//.clearHashkey(uuidKey)
            // No error occured
            logger.debug(`${result.n} document(s) get successfully replaced!`)
            callback(new StatusError_201(`${result.n} document(s) get successfully replaced!`))
        } catch (err) {
            // Unexpected error occured on MongoDb request
            logger.error(`MongoDb error occured! Parameters : 
                            'collection' : ${collection} 
                            'configName' : ${configName} 
                            'queryContent' : ${queryContent} 
                            'Error' : ${err}`)
            callback(new StatusError_502('MongoDb error occured!'))
        }


    } else {
        // Bad request
        logger.error('Please define \'filter\' and \'record\' object in queryContent to update')
        callback(new StatusError_400())
    }
}
/**
 * insertMany
 */
insertMany = async (configName, collection, queryContent, uuidKey, callback) => {
    try {
        // Get mongoConnection with all configuration presetted
        let mongoConnection = link_models.getMongoConnection(configName)
        // Use dynamic name for collection

        // /!\ InsertMany is not a function from Query. It returns a promise!
        // It's not possible to call directly the clear cache function 
        let result = await mongoConnection[`${collection}Schema`].insertMany(queryContent)
        //mongoConnection.clearHashkey(uuidKey)
        // No error occured
        logger.debug(`${result.length} document(s) get successfully inserted!`)
        callback(new StatusError_201(`${result.n} document(s) get successfully inserted!`))
    } catch (err) {
        // Unexpected error occured on MongoDb request
        logger.error(`MongoDb error occured! Parameters : 
                        'collection' : ${collection} 
                        'configName' : ${configName} 
                        'queryContent' : ${queryContent} 
                        'Error' : ${err}`)
        callback(new StatusError_502('MongoDb error occured!'))
    }
}
/**
 * updateMany
 */
updateMany = async (configName, collection, queryContent, uuidKey, callback) => {
    // Update needs filter and $set parameters to be executed
    if (queryContent.filter !== undefined && queryContent.$set !== undefined) {
        try {
            // Get mongoConnection with all configuration presetted
            let mongoConnection = link_models.getMongoConnection(configName)
            // Use dynamic name for collection
            let result = await mongoConnection[`${collection}Schema`].updateMany(queryContent.filter, { $set: queryContent.$set })//.clearHashkey(uuidKey)
            // No error occured
            logger.debug(`${result.n} document(s) get successfully updated!`)
            callback(new StatusError_201(`${result.n} document(s) get successfully updated!`))
        } catch (err) {
            // Unexpected error occured on MongoDb request
            logger.error(`MongoDb error occured! Parameters : 
                                'collection' : ${collection} 
                                'configName' : ${configName} 
                                'queryContent' : ${queryContent} 
                                'Error' : ${err}`)
            callback(new StatusError_502('MongoDb error occured!'))
        }
    } else {
        // Bad request
        logger.error('Please define \'filter\' and \'$set\' object in queryContent to update')
        callback(new StatusError_400())
    }
}