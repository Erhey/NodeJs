const logger = require('link_logger')

const link_models = require('link_models')
module.exports = {

    /**
     * Main function
     * Execute Mongo request
     */
    exec: async (configName, queryType, collection, queryContent, callback) => {
        try {
            logger.info(`received mongo query for
                'configuration' : ${configName},
                'sql' : ${queryType},
                'collection' : ${collection},
                'queryContent' : ${queryContent}`)

            // Dispatch query by type : find / findOne / insertOne / insertMany / replaceOne...
            switch (queryType) {
                case 'find':
                    await find(configName, collection, queryContent, result => {
                        callback(result)
                    })
                    break
                case 'findOne':
                    await findOne(configName, collection, queryContent, result => {
                        callback(result)
                    })
                    break
                case 'insertOne':
                    callback(insertMany(configName, collection, queryContent))
                    break
                case 'insertMany':
                    callback(insertMany(configName, collection, queryContent))
                    break
                case 'replaceOne':
                    callback(replaceOne(configName, collection, queryContent))
                    break
                case 'updateMany':
                    callback(updateMany(configName, collection, queryContent))
                    break
                default:
                    logger.info(`Please define a valuable queryType! queryType : ${queryType}`)
                    callback({
                        status: '400',
                        message: 'Bad request ! Please define a valuable queryType!'
                    })
                    break
            }
        } catch (err) {
            logger.error('Unexpected error occured !' + err)
            callback({
                status: '500',
                message: 'Unexpected error occured !'
            })
        }
    }
}

/**
 * Find
 */
find = async (configName, collection, queryContent, callback) => {
    let mongoConnection = link_models.getMongoConnection(configName)
    // Use dynamic name for collection
    mongoConnection[`${collection}Schema`].find(queryContent, (err, documents) => {
        let result = {}
        if (err) {

            logger.error(`MongoDb error occured! Parameters : 
                                'collection' : ${collection} 
                                'configName' : ${configName} 
                                'queryContent' : ${queryContent} 
                                'Error' : ${err}`)
            result.status = 408
            result.message = 'MongoDb error occured!'
        } else {
            logger.debug(`documents found! : ${documents}`)
            result.status = 201
            result.documents = documents
        }
        callback(result)
    })
}
/**
 * findOne
 */
findOne = async (configName, collection, queryContent, callback) => {

    let mongoConnection = link_models.getMongoConnection(configName)
    mongoConnection[`${collection}Schema`].findOne(queryContent, (err, document) => {
        let result = {}
        if (err) {
            logger.error(`MongoDb error occured! Parameters : 
                                'collection' : ${collection} 
                                'configName' : ${configName} 
                                'queryContent' : ${queryContent} 
                                'Error' : ${err}`)
            result.status = 408
            result.message = 'MongoDb error occured!'
        } else {
            logger.debug(`document found! : ${document}`)
            result.status = 201
            result.document = document
        }
        callback(result)
    })
}


/**
 * replaceOne
 */
replaceOne = async (configName, collection, queryContent) => {

    // Default is upsert = true 
    // If setted to false looks like update
    let upsert = true
    if(queryContent.upsert !== undefined){
        upsert = queryContent.upsert   
    }
    let mongoConnection = link_models.getMongoConnection(configName)
    mongoConnection[`${collection}Schema`].replaceOne(queryContent, { upsert : upsert }, (err, result) => {
        if (err) {
            logger.error(`MongoDb error occured! Parameters : 
                                'collection' : ${collection} 
                                'configName' : ${configName} 
                                'queryContent' : ${queryContent} 
                                'upsert' : ${upsert} 
                                'Error' : ${err}`)
            result.status = 408
            result.message = 'MongoDb error occured!'
        } else {
            logger.debug(`Documents get successfully replaced!`)
            result.status = 201
            result.message = 'Documents get successfully replaced!'
        }
        return result
    })
}
/**
 * insertMany
 */

insertMany = async (configName, collection, queryContent) => {

    let mongoConnection = link_models.getMongoConnection(configName)
    mongoConnection[`${collection}Schema`].insertMany(queryContent, (err, result) => {
        if (err) {
            logger.error(`MongoDb error occured! Parameters : 
                                'collection' : ${collection} 
                                'configName' : ${configName} 
                                'queryContent' : ${queryContent} 
                                'Error' : ${err}`)
            result.status = 408
            result.message = 'MongoDb error occured!'
        } else {
            logger.debug(`Documents get successfully inserted!`)
            result.status = 201
            result.message = 'Documents get successfully inserted!'
        }
        return result
    })
}
/**
 * updateMany
 */
updateMany = async (configName, collection, queryContent) => {
    if (queryContent.conditions !== undefined && queryContent.$set !== undefined) {
        let mongoConnection = link_models.getMongoConnection(configName)
        mongoConnection[`${collection}Schema`].updateMany(queryContent.conditions, { $set: queryContent.$set }, (err, result) => {
            if (err) {
                logger.error(`MongoDb error occured! Parameters : 
                                    'collection' : ${collection} 
                                    'configName' : ${configName} 
                                    'queryContent' : ${queryContent} 
                                    'Error' : ${err}`)
                result.status = 408
                result.message = 'MongoDb error occured!'
            } else {
                logger.debug(`Documents get successfully updated!`)
                result.status = 201
                result.message = 'Documents get successfully updated!'
            }
            return result
        })
    } else {
        logger.error('Please define \'conditions\' and \'$set\' object in queryContent to update')
        result.status = 400
        result.message = 'Bad request for update!'
        return result
    }
}