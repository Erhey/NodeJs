const logger = require('link_logger')

const link_models = require('link_models')
module.exports = {
    exec: async (configName, queryType, collection, queryContent, callback) => {
        try {
            logger.info(`received mongo query for
                'configuration' : ${configName},
                'sql' : ${queryType},
                'collection' : ${collection},
                'queryContent' : ${queryContent}`)
            switch (queryType) {
                case "find":
                    await find(configName, collection, queryContent, result => {
                        callback(result)
                    })
                    break
                case "findOne":
                    await findOne(configName, collection, queryContent, result => {
                        callback(result)
                    })
                    break
                case "insertMany":
                    callback(insertMany(configName, collection, queryContent))
                    break
                case "updateMany":
                    callback(updateMany(configName, collection, queryContent))
                    break
                default:
                    logger.info(`Please define a valuable queryType! queryType : ${queryType}`)
                    callback({
                        status: "400",
                        message: "Bad request ! Please define a valuable queryType!"
                    })
                    break
            }
        } catch (err) {
            logger.error("Unexpected error occured !" + err)
            callback({
                status: "500",
                message: "Unexpected error occured !"
            })
        }
    }
}
find = async (configName, collection, queryContent, callback) => {
    let mongoConnection = link_models.getMongoConnection(configName)
    mongoConnection[`${collection}Schema`].find(queryContent, (err, documents) => {
        let result = {}
        if (err) {
            logger.error(`MongoDb error occured! Parameters : 
                                'collection' : ${collection} 
                                'configName' : ${configName} 
                                'queryContent' : ${queryContent} 
                                'Error' : ${err}`)
            result.status = 408
            result.message = "MongoDb error occured!"
        } else {
            logger.debug(`documents found! : ${documents}`)
            result.status = 201
            result.documents = documents
        }
        callback(result)
    })
}
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
            result.message = "MongoDb error occured!"
        } else {
            logger.debug(`document found! : ${document}`)
            result.status = 201
            result.document = document
        }
        callback(result)
    })
}
insertMany = async (configName, collection, queryContent) => {

    let mongoConnection = link_models.getMongoConnection(configName)
    mongoConnection[`${collection}Schema`].insertMany(queryContent, (err, result) => {
        if (err) {
            logger.error("MongoDb error occured! Error : " + err)
            result.status = 408
            result.message = "MongoDb error occured!"
        } else {
            logger.debug(`Documents get successfully inserted!`)
            result.status = 201
            result.message = 'Documents get successfully inserted!'
        }
        return result
    })
}
updateMany = async (configName, collection, queryContent) => {
    if (queryContent.conditions !== undefined && queryContent.$set !== undefined) {
        let mongoConnection = link_models.getMongoConnection(configName)
        mongoConnection[`${collection}Schema`].updateMany(queryContent.conditions, { $set: queryContent.$set }, (err, result) => {
            if (err) {
                logger.error("MongoDb error occured! Error : " + err)
                result.status = 408
                result.message = "MongoDb error occured!"
            } else {
                logger.debug(`Documents get successfully updated!`)
                result.status = 201
                result.message = 'Documents get successfully updated!'
            }
            return result
        })
    } else {
        logger.error("Please define 'conditions' and '$set' object in queryContent to update")
        result.status = 400
        result.message = "Bad request for update!"
        return result
    }
}