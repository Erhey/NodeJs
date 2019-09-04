
const mongoDbUOW = require('../models/MongoDbUnitOfWork')
const logger = require('link_logger')
const { StatusError_400 } = require('link_http_code')

/**
 * Main function
 * Check if body is well formed and delegate to models the request
 */
module.exports.exec = (req, res) => {
    if(checkBodyMongo(req.body)) {
        // Body is well formed!
        mongoDbUOW.exec(req.body.configName, req.body.queryType, req.body.collection, req.body.queryContent, result => {
            res.status(result.status).send(result)
        })
    } else {
        // Body is not well formed!
        logger.error(`Bad request! Could not get all informations required to execute request! : 
                        'configName'= ${req.body.configName}, 
                        'queryType'= ${req.body.queryType}, 
                        'collection'= ${req.body.collection}`)
        // Send bad request error
        res.status(400).send(new StatusError_400())
    }
}

/**
 * Check if body is well formed
 */
checkBodyMongo = body => {
    return (body.configName !== undefined 
            && body.queryType !== undefined
            && body.collection !== undefined)
}
